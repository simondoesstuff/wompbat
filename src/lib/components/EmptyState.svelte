<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		message: string;
		class?: string;
		children?: Snippet;
	}
	let { icon, message, class: cls = '', children }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center text-neutral-400 gap-2 {cls}">
	<span class={icon}></span>
	<p class="text-sm text-center">{message}</p>
	{#if children}
		{@render children()}
	{/if}
</div>
