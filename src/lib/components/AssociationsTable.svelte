<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';

	interface Props {
		title: string;
		rows: T[];
		hasMore: boolean;
		onLoadMore: () => void;
		onSelect: (row: T) => void;
		isRowSelected: (row: T) => boolean;
		lowHeterogeneity: boolean;
		onLowHeterogeneityChange: (v: boolean) => void;
		exportFilename: string;
		exportHeaders: string[];
		getExportRow: (row: T) => (string | number)[];
		entityLabel?: string;
		columnHeaders: Snippet;
		tableRow: Snippet<[T]>;
	}

	let {
		title,
		rows,
		hasMore,
		onLoadMore,
		onSelect,
		isRowSelected,
		lowHeterogeneity,
		onLowHeterogeneityChange,
		exportFilename,
		exportHeaders,
		getExportRow,
		entityLabel = 'rows',
		columnHeaders,
		tableRow
	}: Props = $props();

	let tableContainer: HTMLElement;

	async function handleKeydown(e: KeyboardEvent) {
		if (!['ArrowDown', 'ArrowUp', 'j', 'k'].includes(e.key)) return;
		if (rows.length === 0) return;
		e.preventDefault();

		const currentIndex = rows.findIndex((r) => isRowSelected(r));
		let nextIndex: number;

		if (e.key === 'ArrowDown' || e.key === 'j') {
			nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, rows.length - 1);
		} else {
			nextIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
		}

		if (nextIndex !== currentIndex || currentIndex === -1) {
			onSelect(rows[nextIndex]);
			await tick();
			tableContainer?.querySelector('tr.bg-primary-100')?.scrollIntoView({ block: 'nearest' });
		}
	}

	function exportTsv() {
		const lines = [
			exportHeaders.join('\t'),
			...rows.map((r) => getExportRow(r).join('\t'))
		];
		const blob = new Blob([lines.join('\n')], { type: 'text/tab-separated-values' });
		const a = document.createElement('a');
		const url = URL.createObjectURL(blob);
		a.href = url;
		a.download = exportFilename;
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 0);
	}
</script>

<!-- Table header controls -->
<div class="flex flex-wrap items-center justify-between gap-2 mb-3">
	<h2 class="text-sm font-semibold text-fg">
		{title}
		<span class="text-neutral-400 font-normal ml-1">{rows.length}{hasMore ? '+' : ''}</span>
	</h2>
	<div class="flex items-center gap-3">
		<label class="flex items-center gap-2 cursor-pointer select-none">
			<input
				type="checkbox"
				checked={lowHeterogeneity}
				onchange={(e) => onLowHeterogeneityChange(e.currentTarget.checked)}
				class="sr-only"
			/>
			<span
				class="relative inline-flex shrink-0 w-7 h-4 rounded-full transition-colors duration-200"
				class:bg-primary-700={lowHeterogeneity}
				class:bg-neutral-400={!lowHeterogeneity}
				aria-hidden="true"
			>
				<span
					class="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
					class:translate-x-3={lowHeterogeneity}
				></span>
			</span>
			<span class="text-xs text-neutral-600">Low Heterogeneity (I² &lt; 40%)</span>
		</label>
		<div class="flex flex-col items-center gap-0.5">
			<button
				onclick={exportTsv}
				class="flex items-center gap-1 text-xs text-neutral-600 hover:text-fg border border-neutral-300 rounded px-2 py-1 hover:border-neutral-400 transition-colors"
			>
				<span class="i-mdi-download text-sm"></span>
				Export TSV
			</button>
			{#if hasMore}
				<span class="text-xs text-neutral-400 italic">loaded rows only</span>
			{/if}
		</div>
	</div>
</div>

<div
	class="overflow-x-auto rounded-md border border-neutral-200 focus:outline-2 focus:outline-primary-400 focus-visible:outline-offset-1"
	bind:this={tableContainer}
	tabindex="0"
	role="grid"
	onkeydown={handleKeydown}
>
	<table class="w-full min-w-max text-xs">
		<thead>
			<tr class="bg-neutral-100 text-neutral-500 uppercase tracking-wide text-left">
				{@render columnHeaders()}
			</tr>
		</thead>
		<tbody>
			{#each rows as row}
				{@const isSelected = isRowSelected(row)}
				<tr
					onclick={() => { tableContainer.focus(); onSelect(row); }}
					class="border-t border-neutral-100 cursor-pointer transition-colors"
					class:bg-primary-100={isSelected}
					class:hover:bg-neutral-50={!isSelected}
				>
					{@render tableRow(row)}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if hasMore}
	<button onclick={onLoadMore} class="show-more-btn">
		↓ Load more {entityLabel}
	</button>
{/if}

<style lang="postcss">
	.show-more-btn {
		@apply mt-2 text-xs text-neutral-500 hover:text-primary-700 transition-colors w-full text-center py-1;
	}
</style>
