<script lang="ts">
  type Swatch = { label: string | number; bg: string };

  const shades = [
    { label: 50, l: 0.95 },
    { label: 100, l: 0.90 },
    { label: 200, l: 0.80 },
    { label: 300, l: 0.70 },
    { label: 400, l: 0.60 },
    { label: 500, l: 0.50 },
    { label: 600, l: 0.40 },
    { label: 700, l: 0.30 },
    { label: 800, l: 0.20 },
    { label: 900, l: 0.10 },
    { label: 950, l: 0.05 },
  ];

  const colors: { name: string; swatches: Swatch[] }[] = [
    ...['primary', 'secondary', 'neutral', 'success', 'failure'].map(name => ({
      name,
      swatches: shades.map(({ label, l }) => ({
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
