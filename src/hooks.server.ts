import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const dark = event.cookies.get('theme') === 'dark';
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			dark ? html.replace('<html', '<html class="dark"') : html,
	});
};
