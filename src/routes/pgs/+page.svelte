<script lang="ts">
	import TwoPanelLayout from '$lib/components/TwoPanelLayout.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import PgsInfoPanel from '$lib/components/PgsInfoPanel.svelte';
	import PhecodeAssociationsTable from '$lib/components/PhecodeAssociationsTable.svelte';
	import ForestPlot from '$lib/components/ForestPlot.svelte';
	import CaseRatesChart from '$lib/components/CaseRatesChart.svelte';
	import { searchByPgs } from '$lib/api';
	import type { PgsSearchResult, PhecodeRow, PgsUnit } from '$lib/types';

	let query = $state('');
	let unit = $state<PgsUnit>('continuous');
	let result = $state<PgsSearchResult | null>(null);
	let loading = $state(false);
	let selectedRow = $state<PhecodeRow | null>(null);
	let lowHeterogeneity = $state(false);

	async function search(q: string) {
		if (!q.trim()) { result = null; selectedRow = null; return; }
		loading = true;
		selectedRow = null;
		try {
			result = await searchByPgs(q.trim(), unit);
		} finally {
			loading = false;
		}
	}

	function setUnit(newUnit: PgsUnit) {
		unit = newUnit;
		if (query.trim()) search(query);
	}
</script>

<TwoPanelLayout>
	{#snippet left()}
		<!-- Search row -->
		<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
			<div class="flex-1 w-full">
				<SearchInput
					bind:value={query}
					placeholder="e.g. PGS000018 (Coronary Artery Disease)"
					onSearch={search}
				/>
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
			<div class="animate-pulse space-y-3">
				<div class="h-20 bg-neutral-100 rounded-lg"></div>
				<div class="h-64 bg-neutral-100 rounded-lg"></div>
			</div>
		{:else if result}
			<PgsInfoPanel info={result.info} />

			<PhecodeAssociationsTable
				rows={result.rows}
				{selectedRow}
				onSelect={(row) => (selectedRow = row)}
				{lowHeterogeneity}
				onLowHeterogeneityChange={(v) => (lowHeterogeneity = v)}
			/>
		{:else}
			<div class="flex flex-col items-center justify-center py-20 text-neutral-400 gap-2">
				<span class="i-mdi-dna text-4xl"></span>
				<p class="text-sm">Enter a PGS ID to explore associations</p>
				<button
					onclick={() => { query = 'PGS000018'; search('PGS000018'); }}
					class="text-xs text-primary-700 hover:underline"
				>
					Try PGS000018 (Coronary Artery Disease)
				</button>
			</div>
		{/if}

		<!-- Mobile: show charts below table -->
		{#if result && selectedRow}
			<div class="lg:hidden pt-2 border-t border-neutral-200">
				<div class="border-2 border-primary-200 rounded-lg p-3 space-y-4">
					<ForestPlot
						title="Stratified Association"
						subtitle={selectedRow.phenotypeName}
						model="Continuous LogOR"
						effects={selectedRow.effects}
					/>
					<div class="border-t border-neutral-200 pt-4">
						<CaseRatesChart
							title="Ancestry Cohorts & Case Rates"
							stats={selectedRow.ancestryStats}
						/>
					</div>
				</div>
			</div>
		{/if}
	{/snippet}

	{#snippet right()}
		{#if result && selectedRow}
			<div class="border-2 border-primary-200 rounded-lg p-3 space-y-4">
				<ForestPlot
					title="Stratified Association"
					subtitle={selectedRow.phenotypeName}
					model="Continuous LogOR"
					effects={selectedRow.effects}
				/>
				<div class="border-t border-neutral-200 pt-4">
					<CaseRatesChart
						title="Ancestry Cohorts & Case Rates"
						stats={selectedRow.ancestryStats}
					/>
				</div>
			</div>
		{:else if result}
			<div class="flex flex-col items-center justify-center h-full text-neutral-400 gap-2">
				<span class="i-mdi-cursor-default-click text-3xl"></span>
				<p class="text-sm text-center">Select a row to view ancestry-stratified associations</p>
			</div>
		{/if}
	{/snippet}
</TwoPanelLayout>
