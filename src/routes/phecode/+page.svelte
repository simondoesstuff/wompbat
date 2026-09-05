<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import TwoPanelLayout from '$lib/components/TwoPanelLayout.svelte';
	import SearchCombobox from '$lib/components/SearchCombobox.svelte';
	import SearchLoadingSkeleton from '$lib/components/SearchLoadingSkeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import PhecodeInfoPanel from '$lib/components/PhecodeInfoPanel.svelte';
	import PgsAssociationsTable from '$lib/components/PgsAssociationsTable.svelte';
	import ForestPlot from '$lib/components/ForestPlot.svelte';
	import CaseRatesChart from '$lib/components/CaseRatesChart.svelte';
	import { searchByPhecode } from '$lib/api';
	import type { PhecodeSearchResult, PgsRow, AutocompleteItem } from '$lib/types';

	let query = $state('');
	let result = $state<PhecodeSearchResult | null>(null);
	let loading = $state(false);
	let selectedRow = $state<PgsRow | null>(null);
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
			result = await searchByPhecode(q.trim());
		} finally {
			loading = false;
		}
	}

	function onCommit(item: AutocompleteItem) {
		goto(`/phecode?id=${encodeURIComponent(item.id)}`, { noScroll: true });
	}

	function crossLinkPgs(pgsId: string) {
		goto(`/pgs?id=${encodeURIComponent(pgsId)}`);
	}
</script>

{#snippet forestCard(row: PgsRow)}
	<div class="border-2 border-primary-200 rounded-lg p-3">
		<ForestPlot
			title="Multi-Ancestry Validation"
			subtitle="{row.pgsId} — {row.efoLabel}"
			model="Continuous LogOR"
			effects={row.effects}
		/>
	</div>
{/snippet}

<TwoPanelLayout>
	{#snippet left()}
		<SearchCombobox mode="phecode" bind:value={query} {onCommit} />

		{#if loading}
			<SearchLoadingSkeleton />
		{:else if result}
			<PhecodeInfoPanel info={result.info} />

			<PgsAssociationsTable
				rows={result.rows}
				{selectedRow}
				onSelect={(row) => (selectedRow = row)}
				{lowHeterogeneity}
				onLowHeterogeneityChange={(v) => (lowHeterogeneity = v)}
				onCrossLink={crossLinkPgs}
			/>
		{:else}
			<EmptyState icon="i-mdi-hospital-box text-4xl" message="Enter a phecode to explore polygenic score associations" class="py-20">
				<button
					onclick={() => onCommit({ id: '250.2', label: 'Type 2 diabetes mellitus' })}
					class="text-xs text-primary-700 hover:underline"
				>
					Try 250.2 (Type 2 diabetes mellitus)
				</button>
			</EmptyState>
		{/if}

		<!-- Mobile: charts below table -->
		{#if result}
			<div class="lg:hidden space-y-3 pt-2 border-t border-neutral-200">
				<CaseRatesChart title="CCPM Biobank" stats={result.ancestryStats} />
				{#if selectedRow}
					{@render forestCard(selectedRow)}
				{/if}
			</div>
		{/if}
	{/snippet}

	{#snippet right()}
		{#if result}
			<CaseRatesChart title="CCPM Biobank" stats={result.ancestryStats} />

			{#if selectedRow}
				{@render forestCard(selectedRow)}
			{:else}
				<EmptyState
					icon="i-mdi-cursor-default-click text-3xl"
					message="Select a model to view ancestry-stratified effects"
					class="border-t border-neutral-100 pt-4 py-10"
				/>
			{/if}
		{:else}
			<EmptyState
				icon="i-mdi-chart-box text-3xl"
				message="Search for a phecode to begin exploring"
				class="h-full"
			/>
		{/if}
	{/snippet}
</TwoPanelLayout>
