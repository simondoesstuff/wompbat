<script lang="ts">
	import { goto } from '$app/navigation';
	import SearchCombobox from '$lib/components/SearchCombobox.svelte';
	import { TOTAL_ASSOCIATIONS } from '$lib/constants';
	import { formatNumber } from '$lib/utils';
	import type { AutocompleteItem } from '$lib/types';

	type SearchMode = 'pgs' | 'phecode';
	let mode = $state<SearchMode>('pgs');
	let query = $state('');

	function onCommit(item: AutocompleteItem) {
		goto(`/${mode}?id=${encodeURIComponent(item.id)}`);
	}

	function switchMode(m: SearchMode) {
		mode = m;
		query = '';
	}
</script>

<svelte:head>
	<title>CCPM Browser</title>
</svelte:head>

<div class="flex flex-1 items-center justify-center px-4 py-16">
	<div class="w-full max-w-xl space-y-8">
		<div class="text-center space-y-1">
			<h1 class="text-2xl font-bold tracking-tight text-fg">CCPM Polygenic Score Browser</h1>
			<p class="text-sm text-neutral-500">
				Explore {formatNumber(TOTAL_ASSOCIATIONS)} PGS–phecode associations
			</p>
		</div>

		<div class="space-y-3">
			<div class="flex justify-center">
				<div class="flex rounded-md border border-neutral-300 overflow-hidden text-sm">
					<button
						onclick={() => switchMode('pgs')}
						class="mode-btn"
						class:active={mode === 'pgs'}
					>
						By Polygenic Score
					</button>
					<button
						onclick={() => switchMode('phecode')}
						class="mode-btn border-l border-neutral-300"
						class:active={mode === 'phecode'}
					>
						By Phecode
					</button>
				</div>
			</div>

			<SearchCombobox {mode} bind:value={query} {onCommit} />

			<p class="text-xs text-neutral-400 text-center">
				{#if mode === 'pgs'}
					e.g.
					<button
						class="text-primary-700 hover:underline"
						onclick={() =>
							onCommit({ id: 'PGS000018', label: 'Coronary Artery Disease' })}>PGS000018</button
					>
					or
					<button
						class="text-primary-700 hover:underline"
						onclick={() =>
							onCommit({ id: 'PGS000054', label: 'Type 2 Diabetes' })}>PGS000054</button
					>
				{:else}
					e.g.
					<button
						class="text-primary-700 hover:underline"
						onclick={() =>
							onCommit({ id: '250.2', label: 'Type 2 diabetes mellitus' })}>250.2</button
					>
					or
					<button
						class="text-primary-700 hover:underline"
						onclick={() => onCommit({ id: '411.4', label: 'Coronary atherosclerosis' })}
						>411.4</button
					>
				{/if}
			</p>
		</div>
	</div>
</div>

<style lang="postcss">
	.mode-btn {
		@apply px-5 py-2 text-neutral-600 transition-colors duration-150;
	}
	.mode-btn:not(.active):hover {
		@apply bg-neutral-100;
	}
	.mode-btn.active {
		@apply bg-primary-700 text-bg;
	}
</style>
