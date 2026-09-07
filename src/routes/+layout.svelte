<script lang="ts">
	import { untrack } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();

	let dark = $state(untrack(() => data.dark));

	function toggleDark() {
		dark = !dark;
		if (dark) {
			document.documentElement.classList.add('dark');
			document.cookie = 'theme=dark; path=/; max-age=31536000; SameSite=Lax';
		} else {
			document.documentElement.classList.remove('dark');
			document.cookie = 'theme=light; path=/; max-age=31536000; SameSite=Lax';
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<AppHeader {dark} {toggleDark} />
	{@render children()}
</div>

<style lang="postcss">
	:global(html, body) {
		@apply bg-bg text-fg;
	}
	/* Hides residual svelteplot y-axis DOM nodes that remain even with y.axis=false */
	:global(.chart-inner .axis-y-title),
	:global(.chart-inner .axis-y),
	:global(.chart-inner .is-left) {
		display: none;
	}
</style>
