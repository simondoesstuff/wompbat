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
	import { searchByPgs } from '$lib/api';
	import type { PgsSearchResult, PhecodeRow, PgsUnit, AutocompleteItem } from '$lib/types';

	let query = $state('');
	let unit = $state<PgsUnit>('continuous');
	let result = $state<PgsSearchResult | null>(null);
	let loading = $state(false);
	let selectedRow = $state<PhecodeRow | null>(null);
	let lowHeterogeneity = $state(false);

	$effect(() => {
		const id = page.url.searchParams.get('id') ?? '';
		if (id) {
			query = id;
			untrack(() => search(id));
		}
	});

	async function search(q: string) {
		if (!q.trim()) {
			result = null;
			selectedRow = null;
			return;
		}
		loading = true;
		selectedRow = null;
		try {
			result = await searchByPgs(q.trim(), unit);
		} finally {
			loading = false;
		}
	}

	function onCommit(item: AutocompleteItem) {
		goto(`/pgs?id=${encodeURIComponent(item.id)}`, { noScroll: true });
	}

	function setUnit(newUnit: PgsUnit) {
		unit = newUnit;
		if (query.trim()) search(query);
	}

	function crossLinkPhecode(phecodeId: string) {
		goto(`/phecode?id=${encodeURIComponent(phecodeId)}`);
	}
</script>

{#snippet chartCard(row: PhecodeRow)}
	<div class="border-2 border-primary-200 rounded-lg p-3 space-y-4">
		<ForestPlot
			title="Stratified Association"
			subtitle={row.phenotypeName}
			model="Continuous LogOR"
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
				<span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">PGS Unit</span>
				<div class="flex rounded-md border border-neutral-300 overflow-hidden text-xs">
					<button
						onclick={() => setUnit('continuous')}
						class="px-3 py-1.5 transition-colors"
						class:bg-primary-700={unit === 'continuous'}
						class:text-bg={unit === 'continuous'}
						class:text-neutral-600={unit !== 'continuous'}
						class:hover:bg-neutral-50={unit !== 'continuous'}
					>
						Continuous
					</button>
					<button
						onclick={() => setUnit('thresholded')}
						class="px-3 py-1.5 border-l border-neutral-300 transition-colors"
						class:bg-primary-700={unit === 'thresholded'}
						class:text-bg={unit === 'thresholded'}
						class:text-neutral-600={unit !== 'thresholded'}
						class:hover:bg-neutral-50={unit !== 'thresholded'}
					>
						Thresholded
					</button>
				</div>
			</div>
		</div>

		{#if loading}
			<SearchLoadingSkeleton />
		{:else if result}
			<PgsInfoPanel info={result.info} />

			<PhecodeAssociationsTable
				rows={result.rows}
				{selectedRow}
				onSelect={(row) => (selectedRow = row)}
				{lowHeterogeneity}
				onLowHeterogeneityChange={(v) => (lowHeterogeneity = v)}
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
		{#if result && selectedRow}
			<div class="lg:hidden pt-2 border-t border-neutral-200">
				{@render chartCard(selectedRow)}
			</div>
		{/if}
	{/snippet}

	{#snippet right()}
		{#if result && selectedRow}
			{@render chartCard(selectedRow)}
		{:else if result}
			<EmptyState
				icon="i-mdi-cursor-default-click text-3xl"
				message="Select a row to view ancestry-stratified associations"
				class="h-full"
			/>
		{/if}
	{/snippet}
</TwoPanelLayout>
