import { generateText, type UIMessage } from 'ai';
import { myProvider } from './models';
import { AIInternalError, type AIError } from '$lib/errors/ai';
import { fromPromise, ok, safeTry, type ResultAsync } from 'neverthrow';

export function generateTitleFromUserMessage({
	message
}: {
	message: UIMessage;
}): ResultAsync<string, AIError> {
	return safeTry(async function* () {
		const result = yield* fromPromise(
			generateText({
				model: myProvider.languageModel('title-model'),
				system: `\n
          - you will generate a short title based on the first message a user begins a conversation with
          - ensure it is not more than 80 characters long
          - the title should be a summary of the user's message
          - do not use quotes or colons`,
				prompt: JSON.stringify(message)
			}),
			(e) => new AIInternalError({ cause: e })
		);

		return ok(result.text);
	});
}
