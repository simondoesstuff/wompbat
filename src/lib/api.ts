import type { PgsSearchResult, PhecodeSearchResult, PgsUnit, AutocompleteItem } from './types';

export async function searchByPgs(_pgsId: string, _unit: PgsUnit): Promise<PgsSearchResult> {
	const { pgsPlaceholder } = await import('./data/placeholder');
	return pgsPlaceholder;
}

export async function searchByPhecode(_phecodeId: string): Promise<PhecodeSearchResult> {
	const { phecodePlaceholder } = await import('./data/placeholder');
	return phecodePlaceholder;
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
