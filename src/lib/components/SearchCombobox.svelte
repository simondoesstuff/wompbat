<script lang="ts">
	import { untrack } from 'svelte';
	import { autocompleteByPgs, autocompleteByPhecode } from '$lib/api';
	import type { AutocompleteItem } from '$lib/types';

	interface Props {
		mode: 'pgs' | 'phecode';
		value?: string;
		onCommit: (item: AutocompleteItem) => void;
	}

	let { mode, value = $bindable(''), onCommit }: Props = $props();

	const placeholders: Record<string, string> = {
		pgs: 'Search by PGS ID or phenotype name…',
		phecode: 'Search by phecode or phenotype name…'
	};

	let suggestions = $state<AutocompleteItem[]>([]);
	let isOpen = $state(false);
	let highlightedIndex = $state(-1);
	let debounceTimer: ReturnType<typeof setTimeout>;
	let containerEl: HTMLDivElement | undefined = $state();

	async function fetchSuggestions(q: string) {
		const results =
			mode === 'pgs' ? await autocompleteByPgs(q) : await autocompleteByPhecode(q);
		suggestions = results;
		isOpen = results.length > 0;
		highlightedIndex = -1;
	}

	function onInput() {
		clearTimeout(debounceTimer);
		if (!value.trim()) {
			suggestions = [];
			isOpen = false;
			return;
		}
		debounceTimer = setTimeout(() => untrack(() => fetchSuggestions(value)), 150);
	}

	function select(item: AutocompleteItem) {
		value = item.id;
		suggestions = [];
		isOpen = false;
		highlightedIndex = -1;
		onCommit(item);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			if (!isOpen) return;
			e.preventDefault();
			highlightedIndex = Math.min(highlightedIndex + 1, suggestions.length - 1);
		} else if (e.key === 'ArrowUp') {
			if (!isOpen) return;
			e.preventDefault();
			highlightedIndex = Math.max(highlightedIndex - 1, -1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const item = highlightedIndex >= 0 ? suggestions[highlightedIndex] : suggestions[0];
			if (item) select(item);
		} else if (e.key === 'Escape') {
			isOpen = false;
			highlightedIndex = -1;
		}
	}

	function handleWindowClick(e: MouseEvent) {
		if (containerEl && !containerEl.contains(e.target as Node)) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<div bind:this={containerEl} class="relative w-full">
	<div class="relative flex items-center">
		<span class="absolute left-3 text-neutral-400 i-mdi-magnify text-lg pointer-events-none"
		></span>
		<input
			type="text"
			bind:value
			placeholder={placeholders[mode]}
			oninput={onInput}
			onkeydown={handleKeydown}
			class="w-full pl-9 pr-8 py-2 text-sm border border-neutral-300 rounded-md bg-bg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent placeholder:text-neutral-400"
		/>
		{#if value}
			<button
				onclick={() => {
					value = '';
					suggestions = [];
					isOpen = false;
				}}
				class="absolute right-3 text-neutral-400 hover:text-neutral-600 i-mdi-close text-base"
				aria-label="Clear"
			></button>
		{/if}
	</div>

	{#if isOpen && suggestions.length > 0}
		<div
			class="absolute top-full left-0 right-0 mt-1 bg-bg border border-neutral-200 rounded-md shadow-lg z-20 overflow-hidden"
		>
			{#each suggestions as item, i}
				<button
					class="w-full text-left px-3 py-2 text-sm flex items-baseline gap-2 transition-colors"
					class:bg-primary-50={highlightedIndex === i}
					class:hover:bg-neutral-50={highlightedIndex !== i}
					onmousedown={(e) => e.preventDefault()}
					onclick={() => select(item)}
				>
					<span class="font-mono font-semibold text-primary-700 shrink-0">{item.id}</span>
					<span class="text-neutral-500 truncate">{item.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
