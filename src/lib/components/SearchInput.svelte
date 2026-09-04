<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		onSearch: (value: string) => void;
	}
	let { value = $bindable(), placeholder = 'Search…', onSearch }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') onSearch(value);
	}
</script>

<div class="relative flex items-center w-full">
	<button
		onclick={() => onSearch(value)}
		class="absolute left-3 text-neutral-400 hover:text-neutral-600 i-mdi-magnify text-lg"
		aria-label="Search"
		tabindex="-1"
	></button>
	<input
		type="text"
		bind:value
		{placeholder}
		onkeydown={handleKeydown}
		class="w-full pl-9 pr-8 py-2 text-sm border border-neutral-300 rounded-md bg-bg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent placeholder:text-neutral-400"
	/>
	{#if value}
		<button
			onclick={() => { value = ''; onSearch(''); }}
			class="absolute right-3 text-neutral-400 hover:text-neutral-600 i-mdi-close text-base"
			aria-label="Clear"
		></button>
	{/if}
</div>
