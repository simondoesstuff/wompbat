<script lang="ts">
	import { formatNumber } from '$lib/utils';
	import InfoCard from './InfoCard.svelte';
	import type { PgsInfo } from '$lib/types';

	interface Props {
		info: PgsInfo;
	}
	let { info }: Props = $props();
</script>

<InfoCard>
	{#snippet left()}
		<div class="flex flex-wrap items-center gap-2 text-xs">
			<a
				href={info.catalogUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="id-link"
			>
				{info.pgsId}
			</a>
			<span class="uppercase tracking-wider text-neutral-400 text-xs">Core Phenotype</span>
			{#if info.pubYear}
				<span class="text-neutral-400">{info.pubYear}</span>
			{/if}
		</div>
		<p class="text-base font-semibold text-fg leading-snug">{info.corePhenotype}</p>
	{/snippet}
	{#snippet right()}
		<p class="text-xs uppercase tracking-wider text-neutral-400">Variants in CCPM</p>
		<p class="text-base font-semibold text-fg">
			{formatNumber(info.ccpmVariants)} <span class="text-xs font-normal text-neutral-500">variants</span>
		</p>
	{/snippet}
</InfoCard>

<style lang="postcss">
	.id-link {
		@apply font-mono font-semibold text-primary-700 hover:underline;
	}
</style>
