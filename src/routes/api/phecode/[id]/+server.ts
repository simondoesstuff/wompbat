import { queryPhecode } from '$lib/server/queries';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const result = await queryPhecode(platform!.env.DB, params.id);
	return Response.json(result);
};
