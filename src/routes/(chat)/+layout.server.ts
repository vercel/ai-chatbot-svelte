import { DEFAULT_CHAT_MODEL } from '$lib/ai/models';
import { SelectedModel } from '$lib/hooks/selected-model.svelte.js';

export async function load({ cookies, locals }) {
	const { user } = locals;
	const sidebarCollapsed = cookies.get('sidebar:state') !== 'true';

	let modelId = cookies.get('modelId');
	if (!modelId) {
		modelId = DEFAULT_CHAT_MODEL;
		cookies.set('selected-model', modelId, {
			path: '/',
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			httpOnly: true,
			sameSite: 'lax'
		});
	}

	return {
		user,
		sidebarCollapsed,
		selectedChatModel: new SelectedModel(modelId)
	};
}
