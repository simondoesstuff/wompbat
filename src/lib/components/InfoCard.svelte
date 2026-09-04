<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		left: Snippet;
		right: Snippet;
	}
	let { left, right }: Props = $props();
</script>

<div class="border border-neutral-200 rounded-lg p-4 bg-primary-50">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="space-y-1 min-w-0">
			{@render left()}
		</div>
		<div class="text-right shrink-0">
			{@render right()}
		</div>
	</div>
</div>
