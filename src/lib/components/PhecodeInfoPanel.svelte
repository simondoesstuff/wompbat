<script lang="ts">
	import type { PhecodeInfo } from '$lib/types';

	interface Props {
		info: PhecodeInfo;
	}
	let { info }: Props = $props();
</script>

<div class="border border-neutral-200 rounded-lg p-4 bg-primary-50">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="space-y-1 min-w-0">
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-2xl font-bold text-fg">Phecode {info.phecodeId}</span>
				<span class="text-xs font-semibold uppercase tracking-wider text-primary-700 bg-primary-100 px-2 py-0.5 rounded">
					{info.cohort}
				</span>
			</div>
			<p class="text-sm text-neutral-600">{info.phenotypeName}</p>
		</div>

		<div class="text-right shrink-0">
			<p class="text-xs uppercase tracking-wider text-neutral-400">Parent Category</p>
			<p class="text-sm font-semibold text-fg">
				<span class="i-mdi-pound text-neutral-400 align-middle"></span>
				{info.parentCategory}
			</p>
		</div>
	</div>
</div>
