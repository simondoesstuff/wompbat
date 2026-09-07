<script lang="ts">
	import { goto } from '$app/navigation';
	import SearchCombobox from '$lib/components/SearchCombobox.svelte';
	import ToggleGroup from '$lib/components/ToggleGroup.svelte';
	import { TOTAL_ASSOCIATIONS } from '$lib/constants';
	import { formatNumber, pgsUrl, phecodeUrl } from '$lib/utils';
	import type { AutocompleteItem } from '$lib/types';

	type SearchMode = 'pgs' | 'phecode';
	let mode = $state<SearchMode>('pgs');
	let query = $state('');

	function onCommit(item: AutocompleteItem) {
		goto(mode === 'pgs' ? pgsUrl(item.id) : phecodeUrl(item.id));
	}

	function switchMode(m: SearchMode) {
		mode = m;
		query = '';
	}
</script>

<svelte:head>
	<title>WOMPBAT</title>
</svelte:head>

<div class="flex flex-1 items-center justify-center px-4 py-16">
	<div class="w-full max-w-xl space-y-8">
		<div class="text-center space-y-1">
			<h1 class="text-4xl p-3 font-display tracking-wide text-fg">WOMPBAT</h1>
			<!-- <h2 class="text-2xl text-neutral-500">Polygenic Score Browser</h2> -->
			<p class="text-md text-neutral-500">
				Explore {formatNumber(TOTAL_ASSOCIATIONS)} PGS–phecode associations
			</p>
		</div>

		<div class="space-y-3">
			<div class="flex justify-center">
				<ToggleGroup
					size="md"
					options={[
						{ value: 'pgs', label: 'By Polygenic Score' },
						{ value: 'phecode', label: 'By Phecode' },
					]}
					value={mode}
					onchange={switchMode}
				/>
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
