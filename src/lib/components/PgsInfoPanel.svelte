<script lang="ts">
	import { formatNumber } from '$lib/utils';
	import type { PgsInfo } from '$lib/types';

	interface Props {
		info: PgsInfo;
	}
	let { info }: Props = $props();
</script>

<div class="border border-neutral-200 rounded-lg p-4 bg-primary-50">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="space-y-1 min-w-0">
			<div class="flex flex-wrap items-center gap-2 text-xs">
				<a
					href={info.catalogUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="font-mono font-semibold text-primary-700 hover:underline"
				>
					{info.pgsId}
				</a>
				<span class="text-neutral-500">{info.modelName}</span>
				<span class="uppercase tracking-wider text-neutral-400 text-xs">Core Phenotype</span>
			</div>
			<p class="text-base font-semibold text-fg leading-snug">{info.corePhenotype}</p>
		</div>

		<div class="text-right shrink-0">
			<p class="text-xs uppercase tracking-wider text-neutral-400">Variants in CCPM</p>
			<p class="text-base font-semibold text-fg">
				{formatNumber(info.ccpmVariants)} <span class="text-xs font-normal text-neutral-500">variants</span>
			</p>
		</div>
	</div>
</div>
