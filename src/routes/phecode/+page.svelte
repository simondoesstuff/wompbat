<script lang="ts">
	import TwoPanelLayout from '$lib/components/TwoPanelLayout.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import PhecodeInfoPanel from '$lib/components/PhecodeInfoPanel.svelte';
	import PgsAssociationsTable from '$lib/components/PgsAssociationsTable.svelte';
	import ForestPlot from '$lib/components/ForestPlot.svelte';
	import CaseRatesChart from '$lib/components/CaseRatesChart.svelte';
	import { searchByPhecode } from '$lib/api';
	import type { PhecodeSearchResult, PgsRow } from '$lib/types';

	let query = $state('');
	let result = $state<PhecodeSearchResult | null>(null);
	let loading = $state(false);
	let selectedRow = $state<PgsRow | null>(null);
	let lowHeterogeneity = $state(false);

	async function search(q: string) {
		if (!q.trim()) { result = null; selectedRow = null; return; }
		loading = true;
		selectedRow = null;
		try {
			result = await searchByPhecode(q.trim());
		} finally {
			loading = false;
		}
	}
</script>

<TwoPanelLayout>
	{#snippet left()}
		<SearchInput
			bind:value={query}
			placeholder="e.g. 250.2 (Type 2 diabetes mellitus)"
			onSearch={search}
		/>

		{#if loading}
			<div class="animate-pulse space-y-3">
				<div class="h-20 bg-neutral-100 rounded-lg"></div>
				<div class="h-64 bg-neutral-100 rounded-lg"></div>
			</div>
		{:else if result}
			<PhecodeInfoPanel info={result.info} />

			<PgsAssociationsTable
				rows={result.rows}
				{selectedRow}
				onSelect={(row) => (selectedRow = row)}
				{lowHeterogeneity}
				onLowHeterogeneityChange={(v) => (lowHeterogeneity = v)}
			/>
		{:else}
			<div class="flex flex-col items-center justify-center py-20 text-neutral-400 gap-2">
				<span class="i-mdi-hospital-box text-4xl"></span>
				<p class="text-sm">Enter a phecode to explore polygenic score associations</p>
				<button
					onclick={() => { query = '250.2'; search('250.2'); }}
					class="text-xs text-primary-700 hover:underline"
				>
					Try 250.2 (Type 2 diabetes mellitus)
				</button>
			</div>
		{/if}

		<!-- Mobile: charts below table -->
		{#if result}
			<div class="lg:hidden space-y-3 pt-2 border-t border-neutral-200">
				<CaseRatesChart title="CCPM Biobank" stats={result.ancestryStats} />
				{#if selectedRow}
					<div class="border-2 border-primary-200 rounded-lg p-3">
						<ForestPlot
							title="Multi-Ancestry Validation"
							subtitle="{selectedRow.pgsId} — {selectedRow.study}"
							model="Continuous LogOR"
							effects={selectedRow.effects}
						/>
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}

	{#snippet right()}
		{#if result}
			<CaseRatesChart title="CCPM Biobank" stats={result.ancestryStats} />

			{#if selectedRow}
				<div class="border-2 border-primary-200 rounded-lg p-3">
					<ForestPlot
						title="Multi-Ancestry Validation"
						subtitle="{selectedRow.pgsId} — {selectedRow.study}"
						model="Continuous LogOR"
						effects={selectedRow.effects}
					/>
				</div>
			{:else}
				<div class="border-t border-neutral-100 pt-4 flex flex-col items-center justify-center py-10 text-neutral-400 gap-2">
					<span class="i-mdi-cursor-default-click text-3xl"></span>
					<p class="text-sm text-center">Select a model to view ancestry-stratified effects</p>
				</div>
			{/if}
		{:else}
			<div class="flex flex-col items-center justify-center h-full text-neutral-400 gap-2">
				<span class="i-mdi-chart-box text-3xl"></span>
				<p class="text-sm text-center">Search for a phecode to begin exploring</p>
			</div>
		{/if}
	{/snippet}
</TwoPanelLayout>
