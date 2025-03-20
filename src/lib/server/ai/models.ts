import { createOpenAI } from '@ai-sdk/openai';
import { createFireworks } from '@ai-sdk/fireworks';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { OPENAI_API_KEY, FIREWORKS_API_KEY } from '$env/static/private';

const openai = createOpenAI({ apiKey: OPENAI_API_KEY });
const fireworks = createFireworks({ apiKey: FIREWORKS_API_KEY });

export const myProvider = customProvider({
	languageModels: {
		'chat-model-small': openai('gpt-4o-mini'),
		'chat-model-large': openai('gpt-4o'),
		'chat-model-reasoning': wrapLanguageModel({
			model: fireworks('accounts/fireworks/models/deepseek-r1'),
			middleware: extractReasoningMiddleware({ tagName: 'think' })
		}),
		'title-model': openai('gpt-4-turbo'),
		'artifact-model': openai('gpt-4o-mini')
	},
	imageModels: {
		'small-model': openai.image('dall-e-2'),
		'large-model': openai.image('dall-e-3')
	}
});
