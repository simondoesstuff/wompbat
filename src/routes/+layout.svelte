<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<AppHeader />
	{@render children()}
</div>

<style lang="postcss">
	:global(html, body) {
		@apply bg-bg text-fg;
	}
</style>
