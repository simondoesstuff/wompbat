import type {
	PgsSearchResult,
	PhecodeSearchResult,
	PgsUnit,
	AutocompleteItem,
} from './types';

export async function searchByPgs(pgsId: string, unit: PgsUnit): Promise<PgsSearchResult> {
	const res = await fetch(`/api/pgs/${encodeURIComponent(pgsId)}?unit=${unit}`);
	return res.json();
}

export async function searchByPhecode(phecodeId: string): Promise<PhecodeSearchResult> {
	const res = await fetch(`/api/phecode/${encodeURIComponent(phecodeId)}`);
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
