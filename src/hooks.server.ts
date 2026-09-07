import type { Handle } from '@sveltejs/kit';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('Cache-Control', `public, max-age=${THIRTY_DAYS}, s-maxage=${THIRTY_DAYS}`);
	return response;
};
