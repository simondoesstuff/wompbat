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

export async function queryPgs(
	db: D1Database,
	pgsId: string,
	unit: PgsUnit,
	offset: number = 0,
	lowHeterogeneity: boolean = false,
): Promise<PgsSearchResult> {
	const fdrCol = unit === 'continuous' ? 'passFDR10p_qPGS' : 'passFDR10p_bPGS';
	const orderCol = unit === 'continuous' ? 'meta_qPGS_pMix' : 'meta_top10pPGS_pMix';
	const i2Col = unit === 'continuous' ? 'meta_qPGS_i2' : 'meta_top10pPGS_i2';
	const i2Clause = lowHeterogeneity ? ` AND ${i2Col} < 40` : '';
	const { results } = await db
		.prepare(
			`SELECT * FROM associations WHERE pgs = ? AND ${fdrCol} = 1${i2Clause} ORDER BY ${orderCol} ASC LIMIT 11 OFFSET ?`,
		)
		.bind(pgsId, offset)
		.all<RawRow>();

	const hasMore = results.length === 11;
	if (hasMore) results.pop();

	const firstRow = results[0];
	return {
		info: {
			pgsId,
			corePhenotype: (firstRow?.efo_label as string) ?? pgsId,
			ccpmVariants: (firstRow?.Nvar as number) ?? 0,
			catalogUrl: `https://www.pgscatalog.org/score/${pgsId}/`,
		},
		rows: results.map((r) => toPhecodeRow(r, unit)),
		hasMore,
	};
}

export async function queryPhecode(
	db: D1Database,
	phecodeId: string,
	offset: number = 0,
	lowHeterogeneity: boolean = false,
): Promise<PhecodeSearchResult> {
	const i2Clause = lowHeterogeneity ? ' AND meta_qPGS_i2 < 40' : '';
	const { results } = await db
		.prepare(
			`SELECT * FROM associations WHERE phecode = ? AND passFDR10p_qPGS = 1${i2Clause} ORDER BY meta_qPGS_pMix ASC LIMIT 11 OFFSET ?`,
		)
		.bind(phecodeId, offset)
		.all<RawRow>();

	const hasMore = results.length === 11;
	if (hasMore) results.pop();

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
		hasMore,
	};
}
