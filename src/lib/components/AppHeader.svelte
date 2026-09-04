<script lang="ts">
	import { page } from '$app/state';
	import NavLink from './NavLink.svelte';
	import { TOTAL_ASSOCIATIONS, GENOME_BUILD, ENSEMBL_VERSION } from '$lib/constants';
	import { formatNumber } from '$lib/utils';

	let isPgs = $derived(page.url.pathname.startsWith('/pgs'));
	let isPhecode = $derived(page.url.pathname.startsWith('/phecode'));
</script>

<header class="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-bg sticky top-0 z-10">
	<div class="flex items-center gap-3 shrink-0">
		<a href="/" class="font-bold text-sm tracking-tight hover:text-primary-700 transition-colors">
			CCPM Browser
		</a>
		<span class="text-xs text-neutral-400 hidden sm:inline">
			{formatNumber(TOTAL_ASSOCIATIONS)} Associations
		</span>
	</div>

	<nav class="flex gap-1 mx-2">
		<NavLink href="/pgs" label="Search by PGS" isActive={isPgs} />
		<NavLink href="/phecode" label="Search by Phecode" isActive={isPhecode} />
	</nav>

	<div class="text-xs text-neutral-400 shrink-0 hidden md:block">
		{GENOME_BUILD} | {ENSEMBL_VERSION}
	</div>
</header>
