import { deriveCI } from '$lib/utils';
import type {
	Ancestry,
	AncestryEffect,
	AncestryStats,
	PgsSearchResult,
	PgsUnit,
	PhecodeRow,
	PhecodeSearchResult,
	PgsRow,
} from '$lib/types';
import type { D1Database } from '@cloudflare/workers-types';

type RawRow = Record<string, unknown>;

const ANCESTRY_COLS: [Ancestry, string][] = [
	['AFR', 'Africa'],
	['AMR', 'America'],
	['CSA', 'Central_South_Asian'],
	['EAS', 'East_Asian'],
	['EUR', 'Europe'],
	['MLE', 'Middle_East'],
];

function extractEffects(row: RawRow, sfx: string): AncestryEffect[] {
	const effects: AncestryEffect[] = [];
	for (const [ancestry, col] of ANCESTRY_COLS) {
		const or = row[`${col}_${sfx}_OR`] as number | null;
		const pval = row[`${col}_${sfx}_pval`] as number | null;
		if (or != null && pval != null) {
			const { ciLower, ciUpper } = deriveCI(or, pval);
			effects.push({ ancestry, or, ci_lower: ciLower, ci_upper: ciUpper });
		}
	}
	const metaOR = row[`meta_${sfx}_FE_OR`] as number | null;
	const metaPval = row[`meta_${sfx}_pMix`] as number | null;
	if (metaOR != null && metaPval != null) {
		const { ciLower, ciUpper } = deriveCI(metaOR, metaPval);
		effects.push({ ancestry: 'Meta', or: metaOR, ci_lower: ciLower, ci_upper: ciUpper });
	}
	return effects;
}

function extractStats(row: RawRow): AncestryStats[] {
	const stats: AncestryStats[] = [];
	for (const [ancestry, col] of ANCESTRY_COLS) {
		const cases = row[`ncase_${col}`] as number | null;
		const controls = row[`ncontrol_${col}`] as number | null;
		if (cases != null && controls != null) {
			stats.push({ ancestry, cases, sample: cases + controls });
		}
	}
	return stats;
}

function toPhecodeRow(row: RawRow, unit: PgsUnit): PhecodeRow {
	const sfx = unit === 'continuous' ? 'qPGS' : 'top10pPGS';
	const metaOR = (row[`meta_${sfx}_FE_OR`] as number) ?? 1;
	const pValue = (row[`meta_${sfx}_pMix`] as number) ?? 1;
	const { ciLower, ciUpper } = deriveCI(metaOR, pValue);
	return {
		phecodeId: row.phecode as string,
		phenotypeName: row.phecode as string,
		metaOR,
		ciLower,
		ciUpper,
		pValue,
		i2: (row[`meta_${sfx}_i2`] as number) ?? 0,
		auc: (row[`avg_auc_pgs_${sfx}`] as number) ?? 0,
		prevalence: (row.preval_ccpm as number) ?? 0,
		effects: extractEffects(row, sfx),
		ancestryStats: extractStats(row),
	};
}

function toPgsRow(row: RawRow): PgsRow {
	const metaOR = (row.meta_qPGS_FE_OR as number) ?? 1;
	const pValue = (row.meta_qPGS_pMix as number) ?? 1;
	const { ciLower, ciUpper } = deriveCI(metaOR, pValue);
	return {
		pgsId: row.pgs as string,
		efoLabel: (row.efo_label as string) ?? (row.pgs as string),
		ccpmVariants: (row.Nvar as number) ?? 0,
		metaOR,
		ciLower,
		ciUpper,
		pValue,
		i2: (row.meta_qPGS_i2 as number) ?? 0,
		auc: (row.avg_auc_pgs_qPGS as number) ?? 0,
		effects: extractEffects(row, 'qPGS'),
	};
}

export async function queryPgs(db: D1Database, pgsId: string, unit: PgsUnit): Promise<PgsSearchResult> {
	const fdrCol = unit === 'continuous' ? 'passFDR10p_qPGS' : 'passFDR10p_bPGS';
	const orderCol = unit === 'continuous' ? 'meta_qPGS_pMix' : 'meta_top10pPGS_pMix';
	const { results } = await db
		.prepare(`SELECT * FROM associations WHERE pgs = ? AND ${fdrCol} = 1 ORDER BY ${orderCol} ASC`)
		.bind(pgsId)
		.all<RawRow>();
	const firstRow = results[0];
	return {
		info: {
			pgsId,
			corePhenotype: (firstRow?.efo_label as string) ?? pgsId,
			ccpmVariants: (firstRow?.Nvar as number) ?? 0,
			catalogUrl: `https://www.pgscatalog.org/score/${pgsId}/`,
		},
		rows: results.map((r) => toPhecodeRow(r, unit)),
	};
}

export async function queryPhecode(db: D1Database, phecodeId: string): Promise<PhecodeSearchResult> {
	const { results } = await db
		.prepare(
			`SELECT * FROM associations WHERE phecode = ? AND passFDR10p_qPGS = 1 ORDER BY meta_qPGS_pMix ASC`
		)
		.bind(phecodeId)
		.all<RawRow>();
	const firstRow = results[0];
	return {
		info: {
			phecodeId,
			phenotypeName: phecodeId,
			domain: (firstRow?.phecode_domain as string) ?? '',
			totalCases: (firstRow?.ncase_meta as number) ?? 0,
			totalSample:
				((firstRow?.ncase_meta as number) ?? 0) + ((firstRow?.ncontrol_meta as number) ?? 0),
		},
		rows: results.map(toPgsRow),
		ancestryStats: firstRow ? extractStats(firstRow) : [],
	};
}
