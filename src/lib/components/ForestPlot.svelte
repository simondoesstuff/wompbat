<script lang="ts">
	import { browser } from '$app/environment';
	import { Plot, RuleX, RuleY, Dot } from 'svelteplot';
	import { ANCESTRY_COLORS, FOREST_BAND_DOMAIN } from '$lib/constants';
	import { formatOR } from '$lib/utils';
	import type { AncestryEffect, Ancestry } from '$lib/types';

	interface Props {
		title: string;
		subtitle: string;
		model?: string;
		effects: AncestryEffect[];
	}
	let { title, subtitle, model, effects }: Props = $props();

	const rowHeight = 32;
	const marginTop = 4;
	const marginBottom = 44;

	// Only include ancestries present in effects, preserving canonical order
	let yDomain = $derived(FOREST_BAND_DOMAIN.filter((a) => effects.some((e) => e.ancestry === a)));
	let displayOrder = $derived([...yDomain].reverse() as Ancestry[]);
	let plotHeight = $derived(yDomain.length * rowHeight + marginTop + marginBottom);

	let chartWidth = $state(0);

	let xDomain = $derived.by(() => {
		if (!effects.length) return [0.5, 2.0];
		const lo = Math.min(...effects.map((e) => e.ci_lower));
		const hi = Math.max(...effects.map((e) => e.ci_upper));
		const pad = (hi - lo) * 0.15;
		return [Math.min(lo - pad, 0.85), hi + pad];
	});

	// Attach literal hex color to each row so Observable Plot uses it directly
	// (bypassing the color scale, which interpolates rather than maps categorically)
	let effectsWithColor = $derived(effects.map((e) => ({ ...e, color: ANCESTRY_COLORS[e.ancestry] })));
</script>

<div>
	<div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1 gap-0.5">
		<span class="section-label">{title}</span>
		{#if model}
			<span class="text-xs text-neutral-400">MODEL {model}</span>
		{/if}
	</div>
	<h3 class="font-semibold text-sm mb-2 text-fg">{subtitle}</h3>

	{#if browser && effects.length > 0}
		<div class="flex items-start gap-0 overflow-x-auto bg-bg p-3 rounded">
			<!-- Ancestry label column -->
			<div
				class="flex flex-col shrink-0 pr-2"
				style="padding-top: {marginTop}px; margin-bottom: {marginBottom}px;"
			>
				{#each displayOrder as ancestry}
					<div
						class="flex items-center justify-end h-8 text-xs font-semibold"
						style="height: {rowHeight}px; color: {ANCESTRY_COLORS[ancestry]};"
					>
						{ancestry}
					</div>
				{/each}
			</div>

			<!-- SveltePlot chart (no y-axis, just CI bars + dots + reference line) -->
			<div class="flex-1 min-w-0 chart-inner" bind:clientWidth={chartWidth}>
				{#if chartWidth > 16}
				<Plot
					height={plotHeight}
					marginLeft={4}
					marginRight={4}
					marginTop={marginTop}
					marginBottom={marginBottom}
					y={{ domain: yDomain, axis: false }}
					x={{ label: 'Effect Size (Odds Ratio)', grid: true, domain: xDomain, labelAnchor: 'center' }}
					>
					<RuleX data={[1]} stroke="#999" strokeDasharray="4,2" strokeWidth={1} />
					<RuleY
						data={effectsWithColor}
						y="ancestry"
						x1="ci_lower"
						x2="ci_upper"
						stroke="color"
						strokeWidth={2.5}
					/>
					<Dot
						data={effectsWithColor}
						x="or"
						y="ancestry"
						fill="color"
						r={5}
						stroke="white"
						strokeWidth={1.5}
					/>
				</Plot>
				{/if}
			</div>

			<!-- OR [CI] text column aligned to chart rows -->
			<div
				class="flex flex-col shrink-0 pl-2 font-mono text-xs text-neutral-600"
				style="padding-top: {marginTop}px; margin-bottom: {marginBottom}px;"
			>
				{#each displayOrder as ancestry}
					{@const eff = effects.find((e) => e.ancestry === ancestry)}
					<div class="flex items-center" style="height: {rowHeight}px;">
						{#if eff}
							{formatOR(eff.or, eff.ci_lower, eff.ci_upper)}
						{:else}
							<span class="text-neutral-300">—</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{:else if !browser}
		<div style="height: {plotHeight}px" class="bg-neutral-50 rounded animate-pulse"></div>
	{/if}
</div>

<style lang="postcss">
	.section-label {
		@apply text-xs font-semibold uppercase tracking-widest text-neutral-500;
	}
</style>
