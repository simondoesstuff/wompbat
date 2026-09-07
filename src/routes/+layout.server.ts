import type { RequestEvent } from '@sveltejs/kit';

export function load({ cookies }: RequestEvent) {
	return { dark: cookies.get('theme') === 'dark' };
}
