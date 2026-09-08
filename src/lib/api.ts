import type {
	PgsSearchResult,
	PhecodeSearchResult,
	PgsUnit,
	AutocompleteItem,
	PgsInfo,
	PhecodeInfo,
	PhecodeRow,
	PgsRow,
	AncestryStats,
} from './types';

type PgsFile = {
	info: PgsInfo;
	continuous: PhecodeRow[];
	thresholded: PhecodeRow[];
};

type PhecodeFile = {
	info: PhecodeInfo;
	rows: PgsRow[];
	ancestryStats: AncestryStats[];
};

const pgsFileCache = new Map<string, PgsFile>();
const phecodeFileCache = new Map<string, PhecodeFile>();

async function fetchPgsFile(pgsId: string): Promise<PgsFile | null> {
	if (pgsFileCache.has(pgsId)) return pgsFileCache.get(pgsId)!;
	const res = await fetch(`/pgs/${encodeURIComponent(pgsId)}.json`);
	if (!res.ok) return null;
	const data: PgsFile = await res.json();
	pgsFileCache.set(pgsId, data);
	return data;
}

async function fetchPhecodeFile(phecodeId: string): Promise<PhecodeFile | null> {
	if (phecodeFileCache.has(phecodeId)) return phecodeFileCache.get(phecodeId)!;
	const res = await fetch(`/phecode/${encodeURIComponent(phecodeId)}.json`);
	if (!res.ok) return null;
	const data: PhecodeFile = await res.json();
	phecodeFileCache.set(phecodeId, data);
	return data;
}

export async function searchByPgs(
	pgsId: string,
	unit: PgsUnit,
	_offset: number = 0,
	lowHeterogeneity: boolean = false,
): Promise<PgsSearchResult> {
	const data = await fetchPgsFile(pgsId);
	if (!data) {
		return {
			info: {
				pgsId,
				corePhenotype: pgsId,
				ccpmVariants: 0,
				catalogUrl: `https://www.pgscatalog.org/score/${pgsId}/`,
				pubYear: null,
			},
			rows: [],
			hasMore: false,
		};
	}
	let rows = (unit === 'thresholded' ? data.thresholded : data.continuous) ?? [];
	if (lowHeterogeneity) rows = rows.filter((r) => r.i2 < 40);
	return { info: data.info, rows, hasMore: false };
}

export async function searchByPhecode(
	phecodeId: string,
	_offset: number = 0,
	lowHeterogeneity: boolean = false,
): Promise<PhecodeSearchResult> {
	const data = await fetchPhecodeFile(phecodeId);
	if (!data) {
		return {
			info: { phecodeId, phenotypeName: phecodeId, domain: '', totalCases: 0, totalSample: 0 },
			rows: [],
			ancestryStats: [],
			hasMore: false,
		};
	}
	const rows = lowHeterogeneity ? data.rows.filter((r) => r.i2 < 40) : data.rows;
	return { ...data, rows, hasMore: false };
}

function matchesPgsId(id: string, q: string): boolean {
	if (id.toLowerCase().startsWith(q)) return true;
	// Allow matching by significant digits only: "485" matches "PGS004859"
	if (/^\d+$/.test(q)) {
		return String(parseInt(id.slice(3), 10)).startsWith(q);
	}
	return false;
}

export async function autocompleteByPgs(query: string): Promise<AutocompleteItem[]> {
	if (!query.trim()) return [];
	const { getAutocompleteIndex } = await import('./autocomplete-db');
	const q = query.toLowerCase();
	const index = await getAutocompleteIndex('pgs');
	return index
		.filter((item) => matchesPgsId(item.id, q) || item.label.toLowerCase().startsWith(q))
		.slice(0, 8);
}

export async function autocompleteByPhecode(query: string): Promise<AutocompleteItem[]> {
	if (!query.trim()) return [];
	const { getAutocompleteIndex } = await import('./autocomplete-db');
	const q = query.toLowerCase();
	const index = await getAutocompleteIndex('phecode');
	return index
		.filter((item) => item.id.startsWith(q) || item.label.toLowerCase().startsWith(q))
		.slice(0, 8);
}
