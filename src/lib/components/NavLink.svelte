<script lang="ts">
	interface Props {
		href: string;
		label: string;
		isActive: boolean;
	}
	let { href, label, isActive }: Props = $props();
</script>

<a
	{href}
	class="px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap"
	class:bg-primary-700={isActive}
	class:text-bg={isActive}
	class:text-neutral-600={!isActive}
	class:hover:bg-neutral-100={!isActive}
>
	{label}
</a>
