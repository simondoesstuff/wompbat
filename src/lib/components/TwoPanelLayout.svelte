<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		left: Snippet;
		right: Snippet;
	}
	let { left, right }: Props = $props();
</script>

<div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
	<div class="flex flex-col flex-1 lg:flex-[3] overflow-y-auto p-4 gap-4">
		{@render left()}
	</div>
	<div class="hidden lg:flex flex-col lg:flex-[2] border-l border-neutral-200 overflow-y-auto p-4 gap-6">
		{@render right()}
	</div>
</div>
