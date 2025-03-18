import { getVotesByChatId } from '$lib/server/db/queries.js';
import { error } from '@sveltejs/kit';

export async function GET({ locals: { user }, params: { chatId } }) {
	if (!user) {
		error(401, 'Unauthorized');
	}

	return getVotesByChatId({ id: chatId }).match(
		(votes) => Response.json(votes),
		() => error(500, 'An error occurred while processing your request')
	);
}
