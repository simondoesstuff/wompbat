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
