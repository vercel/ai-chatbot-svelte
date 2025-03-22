import { createXai } from '@ai-sdk/xai';
import { createGroq } from '@ai-sdk/groq';
import { createFal } from '@ai-sdk/fal';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { XAI_API_KEY, GROQ_API_KEY, FAL_API_KEY } from '$env/static/private';

const xai = createXai({ apiKey: XAI_API_KEY });
const groq = createGroq({ apiKey: GROQ_API_KEY });
const fal = createFal({ apiKey: FAL_API_KEY });

export const myProvider = customProvider({
	languageModels: {
		'chat-model': xai('grok-2-1212'),
		'chat-model-reasoning': wrapLanguageModel({
			model: groq('deepseek-r1-distill-llama-70b'),
			middleware: extractReasoningMiddleware({ tagName: 'think' })
		}),
		'title-model': xai('grok-2-1212'),
		'artifact-model': xai('grok-2-1212')
	},
	imageModels: {
		'small-model': fal.image('fal-ai/fast-sdxl')
	}
});
