import { getDB } from './db';
import { deriveCI } from './utils';
import type {
	PgsSearchResult,
	PhecodeSearchResult,
	PgsUnit,
	AutocompleteItem,
	AncestryEffect,
	AncestryStats,
	PhecodeRow,
	PgsRow,
} from './types';
import type { Ancestry } from './types';

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
	const fdrCol = unit === 'continuous' ? 'passFDR10p_qPGS' : 'passFDR10p_bPGS';
	void fdrCol; // used in WHERE, not here
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

export async function searchByPgs(pgsId: string, unit: PgsUnit): Promise<PgsSearchResult> {
	const db = await getDB();
	const fdrCol = unit === 'continuous' ? 'passFDR10p_qPGS' : 'passFDR10p_bPGS';
	const orderCol = unit === 'continuous' ? 'meta_qPGS_pMix' : 'meta_top10pPGS_pMix';
	const raw = await db.exec(
		`SELECT * FROM associations WHERE pgs = ? AND ${fdrCol} = 1 ORDER BY ${orderCol} ASC`,
		[pgsId],
		{ rowMode: 'object' }
	);
	const rows = raw.map((r) => toPhecodeRow(r.row as RawRow, unit));
	const firstRow = raw[0]?.row as RawRow | undefined;
	return {
		info: {
			pgsId,
			corePhenotype: (firstRow?.efo_label as string) ?? pgsId,
			ccpmVariants: (firstRow?.Nvar as number) ?? 0,
			catalogUrl: `https://www.pgscatalog.org/score/${pgsId}/`,
		},
		rows,
	};
}

export async function searchByPhecode(phecodeId: string): Promise<PhecodeSearchResult> {
	const db = await getDB();
	const raw = await db.exec(
		`SELECT * FROM associations WHERE phecode = ? AND passFDR10p_qPGS = 1 ORDER BY meta_qPGS_pMix ASC`,
		[phecodeId],
		{ rowMode: 'object' }
	);
	const rows = raw.map((r) => toPgsRow(r.row as RawRow));
	const firstRow = raw[0]?.row as RawRow | undefined;
	return {
		info: {
			phecodeId,
			phenotypeName: phecodeId,
			domain: (firstRow?.phecode_domain as string) ?? '',
			totalCases: (firstRow?.ncase_meta as number) ?? 0,
			totalSample:
				((firstRow?.ncase_meta as number) ?? 0) + ((firstRow?.ncontrol_meta as number) ?? 0),
		},
		rows,
		ancestryStats: firstRow ? extractStats(firstRow) : [],
	};
}

export async function autocompleteByPgs(query: string): Promise<AutocompleteItem[]> {
	const { pgsAutocompleteData } = await import('./data/placeholder');
	if (!query.trim()) return [];
	const q = query.toLowerCase();
	return pgsAutocompleteData
		.filter((item) => item.id.toLowerCase().includes(q) || item.label.toLowerCase().includes(q))
		.slice(0, 8);
}

export async function autocompleteByPhecode(query: string): Promise<AutocompleteItem[]> {
	const { phecodeAutocompleteData } = await import('./data/placeholder');
	if (!query.trim()) return [];
	const q = query.toLowerCase();
	return phecodeAutocompleteData
		.filter((item) => item.id.toLowerCase().includes(q) || item.label.toLowerCase().includes(q))
		.slice(0, 8);
}
