<script lang="ts">
	import { browser } from '$app/environment';
	import { Plot, BarX, RuleX } from 'svelteplot';
	import { ANCESTRY_COLORS, COHORT_BAND_DOMAIN } from '$lib/constants';
	import { formatNumber } from '$lib/utils';
	import type { AncestryStats, Ancestry } from '$lib/types';

	interface Props {
		title: string;
		stats: AncestryStats[];
	}
	let { title, stats }: Props = $props();

	const rowHeight = 28;
	const marginTop = 4;
	const marginBottom = 40;

	// Only include ancestries present in stats, preserving canonical order
	let yDomain = $derived(COHORT_BAND_DOMAIN.filter((a) => stats.some((s) => s.ancestry === a)));
	let displayOrder = $derived([...yDomain].reverse() as Ancestry[]);
	let plotHeight = $derived(yDomain.length * rowHeight + marginTop + marginBottom);

	let chartWidth = $state(0);

	let maxSample = $derived(Math.max(...stats.map((s) => s.sample), 1));

	// Embed literal hex colors so Observable Plot uses them directly without a color scale
	let caseData = $derived(
		stats.map((s) => ({ ...s, proportion: s.cases / maxSample, color: ANCESTRY_COLORS[s.ancestry] }))
	);
	let sampleData = $derived(
		stats.map((s) => ({ ...s, proportion: s.sample / maxSample, color: ANCESTRY_COLORS[s.ancestry] }))
	);
</script>

<div>
	<span class="section-label">{title}</span>

	{#if browser && stats.length > 0}
		<div class="flex items-start gap-0 mt-1 bg-bg rounded p-3">
			<!-- Ancestry label column -->
			<div class="flex flex-col shrink-0 pr-2" style="padding-top: {marginTop}px; margin-bottom: {marginBottom}px;">
				{#each displayOrder as ancestry}
					{@const s = stats.find((r) => r.ancestry === ancestry)}
					<div
						class="flex items-center justify-end h-7 text-xs font-semibold"
						style="height: {rowHeight}px; color: {ANCESTRY_COLORS[ancestry]};"
					>
						{ancestry}
					</div>
				{/each}
			</div>

			<!-- SveltePlot bar chart -->
			<div class="flex-1 min-w-0 chart-inner" bind:clientWidth={chartWidth}>
				{#if chartWidth > 16}
				<Plot
					height={plotHeight}
					marginLeft={4}
					marginRight={4}
					marginTop={marginTop}
					marginBottom={marginBottom}
					y={{ domain: yDomain, axis: false }}
					x={{ label: 'Proportion of cohort', domain: [0, 1.05] }}
				>
					<RuleX data={[0]} stroke="#ccc" strokeWidth={1} />
					<!-- Sample bars (background, transparent) -->
					<BarX data={sampleData} x="proportion" y="ancestry" fill="color" opacity={0.2} inset={0} />
					<!-- Case bars (foreground, solid — shorter by data, not by inset) -->
					<BarX data={caseData} x="proportion" y="ancestry" fill="color" opacity={0.85} inset={0} />
				</Plot>
				{/if}
			</div>

			<!-- Counts text column -->
			<div
				class="flex flex-col shrink-0 pl-2 text-xs text-neutral-500"
				style="padding-top: {marginTop}px; margin-bottom: {marginBottom}px;"
			>
				{#each displayOrder as ancestry}
					{@const s = stats.find((r) => r.ancestry === ancestry)}
					<div class="flex items-center leading-tight" style="height: {rowHeight}px;">
						{#if s}
							<span>Cases: {formatNumber(s.cases)} | Sample: {formatNumber(s.sample)}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{:else if !browser}
		<div style="height: {plotHeight}px" class="bg-neutral-50 rounded animate-pulse mt-1"></div>
	{/if}
</div>

<style lang="postcss">
	.section-label {
		@apply text-xs font-semibold uppercase tracking-widest text-neutral-500;
	}
</style>
