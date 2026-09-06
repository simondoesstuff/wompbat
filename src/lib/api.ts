import type {
	PgsSearchResult,
	PhecodeSearchResult,
	PgsUnit,
	AutocompleteItem,
} from './types';

export async function searchByPgs(
	pgsId: string,
	unit: PgsUnit,
	offset: number = 0,
	lowHeterogeneity: boolean = false,
): Promise<PgsSearchResult> {
	const params = new URLSearchParams({ unit, offset: String(offset), lowHeterogeneity: String(lowHeterogeneity) });
	const res = await fetch(`/api/pgs/${encodeURIComponent(pgsId)}?${params}`);
	return res.json();
}

export async function searchByPhecode(
	phecodeId: string,
	offset: number = 0,
	lowHeterogeneity: boolean = false,
): Promise<PhecodeSearchResult> {
	const params = new URLSearchParams({ offset: String(offset), lowHeterogeneity: String(lowHeterogeneity) });
	const res = await fetch(`/api/phecode/${encodeURIComponent(phecodeId)}?${params}`);
	return res.json();
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
