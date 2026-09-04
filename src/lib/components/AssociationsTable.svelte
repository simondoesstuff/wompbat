<script lang="ts" generics="T extends { i2: number }">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		rows: T[];
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

	let showAll = $state(false);
	let filteredRows = $derived(lowHeterogeneity ? rows.filter((r) => r.i2 < 40) : rows);
	let displayedRows = $derived(showAll ? filteredRows : filteredRows.slice(0, 10));
	let remaining = $derived(Math.max(0, filteredRows.length - 10));

	function exportTsv() {
		const lines = [
			exportHeaders.join('\t'),
			...filteredRows.map((r) => getExportRow(r).join('\t'))
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
		<span class="text-neutral-400 font-normal ml-1">{filteredRows.length}</span>
	</h2>
	<div class="flex items-center gap-3">
		<label class="flex items-center gap-1.5 cursor-pointer select-none">
			<input
				type="checkbox"
				checked={lowHeterogeneity}
				onchange={(e) => onLowHeterogeneityChange(e.currentTarget.checked)}
				class="accent-primary-700 w-3.5 h-3.5"
			/>
			<span class="text-xs text-neutral-600">Low Heterogeneity (I² &lt; 40%)</span>
		</label>
		<button
			onclick={exportTsv}
			class="flex items-center gap-1 text-xs text-neutral-600 hover:text-fg border border-neutral-300 rounded px-2 py-1 hover:border-neutral-400 transition-colors"
		>
			<span class="i-mdi-download text-sm"></span>
			Export TSV
		</button>
	</div>
</div>

<div class="overflow-x-auto rounded-md border border-neutral-200">
	<table class="w-full min-w-max text-xs">
		<thead>
			<tr class="bg-neutral-100 text-neutral-500 uppercase tracking-wide text-left">
				{@render columnHeaders()}
			</tr>
		</thead>
		<tbody>
			{#each displayedRows as row}
				{@const isSelected = isRowSelected(row)}
				<tr
					onclick={() => onSelect(row)}
					class="border-t border-neutral-100 cursor-pointer transition-colors"
					class:bg-primary-50={isSelected}
					class:hover:bg-neutral-50={!isSelected}
				>
					{@render tableRow(row)}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if !showAll && remaining > 0}
	<button
		onclick={() => (showAll = true)}
		class="mt-2 text-xs text-neutral-500 hover:text-primary-700 transition-colors w-full text-center py-1"
	>
		↓ See more {entityLabel} ({remaining} remaining)
	</button>
{:else if showAll && remaining > 0}
	<button
		onclick={() => (showAll = false)}
		class="mt-2 text-xs text-neutral-500 hover:text-primary-700 transition-colors w-full text-center py-1"
	>
		↑ Show fewer
	</button>
{/if}
