export function createPagination<TResult extends { rows: any[]; hasMore: boolean }>(
	fetch: (offset: number, lowHeterogeneity: boolean) => Promise<TResult>,
) {
	let allRows = $state<TResult['rows']>([]);
	let hasMore = $state(false);
	let offset = $state(0);
	let loading = $state(false);
	let loadingMore = $state(false);
	let lowHeterogeneity = $state(false);

	function clear() {
		allRows = [];
		hasMore = false;
		offset = 0;
	}

	async function search(): Promise<TResult | undefined> {
		loading = true;
		clear();
		try {
			const result = await fetch(0, lowHeterogeneity);
			allRows = result.rows;
			hasMore = result.hasMore;
			return result;
		} finally {
			loading = false;
		}
	}

	async function loadMore() {
		if (loading || loadingMore) return;
		loadingMore = true;
		const nextOffset = offset + 10;
		try {
			const result = await fetch(nextOffset, lowHeterogeneity);
			allRows = [...allRows, ...result.rows];
			hasMore = result.hasMore;
			offset = nextOffset;
		} catch {
			// leave rows intact on error
		} finally {
			loadingMore = false;
		}
	}

	function setLowHeterogeneity(v: boolean) {
		lowHeterogeneity = v;
	}

	return {
		get allRows() { return allRows; },
		get hasMore() { return hasMore; },
		get loading() { return loading; },
		get lowHeterogeneity() { return lowHeterogeneity; },
		clear,
		search,
		loadMore,
		setLowHeterogeneity,
	};
}
