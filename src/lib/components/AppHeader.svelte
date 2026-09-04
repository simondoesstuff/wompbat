<script lang="ts">
	import { page } from '$app/state';
	import { TOTAL_ASSOCIATIONS, GENOME_BUILD, ENSEMBL_VERSION } from '$lib/constants';
	import { formatNumber } from '$lib/utils';

	let isPgs = $derived(page.url.pathname.startsWith('/pgs'));
	let isPhecode = $derived(page.url.pathname.startsWith('/phecode'));
</script>

<header class="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-bg sticky top-0 z-10">
	<div class="flex items-center gap-3 shrink-0">
		<span class="font-bold text-sm tracking-tight">CCPM Browser</span>
		<span class="text-xs text-neutral-400 hidden sm:inline">
			{formatNumber(TOTAL_ASSOCIATIONS)} Associations
		</span>
	</div>

	<nav class="flex gap-1 mx-2">
		<a
			href="/pgs"
			class="px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap"
			class:bg-primary-700={isPgs}
			class:text-bg={isPgs}
			class:text-neutral-600={!isPgs}
			class:hover:bg-neutral-100={!isPgs}
		>
			Search by PGS
		</a>
		<a
			href="/phecode"
			class="px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap"
			class:bg-primary-700={isPhecode}
			class:text-bg={isPhecode}
			class:text-neutral-600={!isPhecode}
			class:hover:bg-neutral-100={!isPhecode}
		>
			Search by Phecode
		</a>
	</nav>

	<div class="text-xs text-neutral-400 shrink-0 hidden md:block">
		{GENOME_BUILD} | {ENSEMBL_VERSION}
	</div>
</header>
