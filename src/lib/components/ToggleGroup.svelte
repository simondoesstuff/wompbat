<script lang="ts" generics="T extends string">
	interface Props {
		options: { value: T; label: string }[];
		value: T;
		onchange: (v: T) => void;
		size?: 'sm' | 'md';
	}
	let { options, value, onchange, size = 'sm' }: Props = $props();
</script>

<div
	class="flex rounded-md border border-neutral-300 overflow-hidden"
	class:text-xs={size === 'sm'}
	class:text-sm={size === 'md'}
>
	{#each options as opt, i}
		<button
			onclick={() => onchange(opt.value)}
			class="toggle-btn"
			class:toggle-sm={size === 'sm'}
			class:toggle-md={size === 'md'}
			class:border-l={i > 0}
			class:border-neutral-300={i > 0}
			class:active={value === opt.value}
		>
			{opt.label}
		</button>
	{/each}
</div>

<style lang="postcss">
	.toggle-btn {
		@apply text-neutral-600 transition-colors duration-150;
	}
	.toggle-btn:not(.active):hover {
		@apply bg-neutral-100;
	}
	.toggle-btn.active {
		@apply bg-primary-700 text-bg;
	}
	.toggle-sm {
		@apply px-3 py-1.5;
	}
	.toggle-md {
		@apply px-5 py-2;
	}
</style>
