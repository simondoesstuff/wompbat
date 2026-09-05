import { queryPhecode } from '$lib/server/queries';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, platform }) => {
	const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
	const lowHeterogeneity = url.searchParams.get('lowHeterogeneity') === 'true';
	const result = await queryPhecode(platform!.env.DB, params.id, offset, lowHeterogeneity);
	return Response.json(result);
};
