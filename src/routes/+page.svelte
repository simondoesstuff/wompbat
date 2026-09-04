<script lang="ts">
	// Client-side fallback; server redirect handles the primary case
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	if (browser) goto('/pgs', { replaceState: true });
</script>
