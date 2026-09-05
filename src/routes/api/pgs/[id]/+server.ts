import { queryPgs } from '$lib/server/queries';
import type { PgsUnit } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, platform }) => {
	const unit = (url.searchParams.get('unit') ?? 'continuous') as PgsUnit;
	const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
	const lowHeterogeneity = url.searchParams.get('lowHeterogeneity') === 'true';
	const result = await queryPgs(platform!.env.DB, params.id, unit, offset, lowHeterogeneity);
	return Response.json(result);
};
