import type { PgsSearchResult, PhecodeSearchResult, PgsUnit } from './types';

export async function searchByPgs(
	_pgsId: string,
	_unit: PgsUnit
): Promise<PgsSearchResult> {
	const { pgsPlaceholder } = await import('./data/placeholder');
	return pgsPlaceholder;
}

export async function searchByPhecode(_phecodeId: string): Promise<PhecodeSearchResult> {
	const { phecodePlaceholder } = await import('./data/placeholder');
	return phecodePlaceholder;
}
