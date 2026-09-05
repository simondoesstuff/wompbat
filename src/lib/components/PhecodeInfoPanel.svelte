<script lang="ts">
	import { formatNumber } from '$lib/utils';
	import InfoCard from './InfoCard.svelte';
	import type { PhecodeInfo } from '$lib/types';

	interface Props {
		info: PhecodeInfo;
	}
	let { info }: Props = $props();
</script>

<InfoCard>
	{#snippet left()}
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-2xl font-bold text-fg">Phecode {info.phecodeId}</span>
			<span class="text-xs font-semibold uppercase tracking-wider text-primary-700 bg-primary-100 px-2 py-0.5 rounded">
				{info.domain}
			</span>
		</div>
		<p class="text-sm text-neutral-600">{info.phenotypeName}</p>
	{/snippet}
	{#snippet right()}
		<p class="text-xs uppercase tracking-wider text-neutral-400">CCPM Biobank</p>
		<p class="text-sm font-semibold text-fg">
			{formatNumber(info.totalCases)} cases
			<span class="text-xs font-normal text-neutral-500">/ {formatNumber(info.totalSample)} total</span>
		</p>
	{/snippet}
</InfoCard>
