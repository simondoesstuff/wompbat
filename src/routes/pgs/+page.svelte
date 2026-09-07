<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import TwoPanelLayout from '$lib/components/TwoPanelLayout.svelte';
	import SearchCombobox from '$lib/components/SearchCombobox.svelte';
	import SearchLoadingSkeleton from '$lib/components/SearchLoadingSkeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import PgsInfoPanel from '$lib/components/PgsInfoPanel.svelte';
	import PhecodeAssociationsTable from '$lib/components/PhecodeAssociationsTable.svelte';
	import ForestPlot from '$lib/components/ForestPlot.svelte';
	import CaseRatesChart from '$lib/components/CaseRatesChart.svelte';
	import ToggleGroup from '$lib/components/ToggleGroup.svelte';
	import { searchByPgs } from '$lib/api';
	import { createPagination } from '$lib/pagination.svelte';
	import { pgsUrl, phecodeUrl } from '$lib/utils';
	import type { PgsInfo, PhecodeRow, PgsUnit, AutocompleteItem } from '$lib/types';

	let query = $state('');
	let unit = $state<PgsUnit>('continuous');
	let info = $state<PgsInfo | null>(null);
	let selectedRow = $state<PhecodeRow | null>(null);

	const pag = createPagination((offset, lh) => searchByPgs(query, unit, offset, lh));

	$effect(() => {
		const id = page.url.searchParams.get('id') ?? '';
		if (id) {
			query = id;
			untrack(() => runSearch(id));
		}
	});

	async function runSearch(q: string) {
		if (!q.trim()) {
			info = null;
			pag.clear();
			selectedRow = null;
			return;
		}
		selectedRow = null;
		const result = await pag.search();
		if (result) info = result.info;
	}

	function onCommit(item: AutocompleteItem) {
		goto(pgsUrl(item.id), { noScroll: true });
	}

	function setUnit(newUnit: PgsUnit) {
		unit = newUnit;
		if (query.trim()) runSearch(query);
	}

	function onLowHeterogeneityChange(v: boolean) {
		pag.setLowHeterogeneity(v);
		if (query.trim() && info) runSearch(query.trim());
	}

	function crossLinkPhecode(phecodeId: string) {
		goto(phecodeUrl(phecodeId));
	}
</script>

{#snippet chartCard(row: PhecodeRow)}
	<div class="border-2 border-primary-200 rounded-lg p-3 space-y-4 bg-white dark:bg-black">
		<ForestPlot
			title="Multi-Ancestry Association"
			subtitle="{info?.pgsId} — {info?.corePhenotype}"
			effects={row.effects}
		/>
		<div class="border-t border-neutral-200 pt-4">
			<CaseRatesChart title="Ancestry Cohorts & Case Rates" stats={row.ancestryStats} />
		</div>
	</div>
{/snippet}

<TwoPanelLayout>
	{#snippet left()}
		<!-- Search row -->
		<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
			<div class="flex-1 w-full">
				<SearchCombobox mode="pgs" bind:value={query} {onCommit} />
			</div>

			<div class="flex items-center gap-2 shrink-0">
				<span class="section-label">PGS Unit</span>
				<ToggleGroup
					options={[
						{ value: 'continuous', label: 'Continuous' },
						{ value: 'thresholded', label: 'Thresholded' },
					]}
					value={unit}
					onchange={setUnit}
				/>
			</div>
		</div>

		{#if pag.loading}
			<SearchLoadingSkeleton />
		{:else if info}
			<PgsInfoPanel {info} />

			<PhecodeAssociationsTable
				rows={pag.allRows}
				hasMore={pag.hasMore}
				onLoadMore={pag.loadMore}
				{selectedRow}
				onSelect={(row) => (selectedRow = row)}
				lowHeterogeneity={pag.lowHeterogeneity}
				{onLowHeterogeneityChange}
				onCrossLink={crossLinkPhecode}
			/>
		{:else}
			<EmptyState icon="i-mdi-dna text-4xl" message="Enter a PGS ID to explore associations" class="py-20">
				<button
					onclick={() => onCommit({ id: 'PGS000018', label: 'Coronary Artery Disease' })}
					class="text-xs text-primary-700 hover:underline"
				>
					Try PGS000018 (Coronary Artery Disease)
				</button>
			</EmptyState>
		{/if}

		<!-- Mobile: show charts below table -->
		{#if info && selectedRow}
			<div class="lg:hidden pt-2 border-t border-neutral-200">
				{@render chartCard(selectedRow)}
			</div>
		{/if}
	{/snippet}

	{#snippet right()}
		{#if info && selectedRow}
			{@render chartCard(selectedRow)}
		{:else if info}
			<EmptyState
				icon="i-mdi-cursor-default-click text-3xl"
				message="Select a row to view ancestry-stratified associations"
				class="h-full"
			/>
		{/if}
	{/snippet}
</TwoPanelLayout>
