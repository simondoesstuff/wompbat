<script lang="ts">
  import { SHADE_SCALE } from '$lib/theme-scale';

  type Swatch = { label: string | number; bg: string };

  const colors: { name: string; swatches: Swatch[] }[] = [
    ...['primary', 'secondary', 'neutral', 'success', 'failure'].map(name => ({
      name,
      swatches: SHADE_SCALE.map(({ label, l }) => ({
        label,
        bg: `oklch(from var(--color-${name}) ${l} c h)`,
      })),
    })),
		{name: 'bg/fg', swatches: [{label: "bg", bg: 'var(--color-bg)'}, {label: "fg", bg: 'var(--color-fg)'}]}
  ];
</script>

{#snippet section(name: string, swatches: Swatch[])}
  <section class="space-y-2">
    <h2 class="text-sm font-semibold uppercase tracking-widest opacity-50">{name}</h2>
    <div class="flex gap-1">
      {#each swatches as swatch}
        <div class="flex-1 flex flex-col items-center gap-1">
          <div class="w-full h-12 rounded" style="background: {swatch.bg}"></div>
          <span class="text-xs opacity-40">{swatch.label}</span>
        </div>
      {/each}
    </div>
  </section>
{/snippet}

{#snippet swatches()}
  {#each colors as color}
    {@render section(color.name, color.swatches)}
  {/each}
{/snippet}

<div class="p-8 space-y-10 bg-bg text-fg">
  <h1 class="text-2xl font-bold">Light</h1>
  {@render swatches()}
</div>

<div class="dark p-8 space-y-10 bg-bg text-fg">
  <h1 class="text-2xl font-bold">Dark</h1>
  {@render swatches()}
</div>
