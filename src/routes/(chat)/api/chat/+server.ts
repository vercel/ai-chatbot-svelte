import { myProvider } from '$lib/server/ai/models';
import { systemPrompt } from '$lib/server/ai/prompts.js';
import { generateTitleFromUserMessage } from '$lib/server/ai/utils';
import { deleteChatById, getChatById, saveChat, saveMessages } from '$lib/server/db/queries.js';
import type { Chat } from '$lib/server/db/schema';
import { getMostRecentUserMessage, getTrailingMessageId } from '$lib/utils/chat.js';
import { allowAnonymousChats } from '$lib/utils/constants.js';
import { error } from '@sveltejs/kit';
import {
    convertToModelMessages, 
    streamText,
    type UIMessage,
} from 'ai';
import { z } from 'zod';

// Define metadata schema
const metadataSchema = z.object({
    duration: z.number().optional(),
    model: z.string().optional(),
    totalTokens: z.number().optional(),
});

type MessageMetadata = z.infer<typeof metadataSchema>;

export async function POST({ request, locals: { user }, cookies }) {
    const { id, messages }: { id: string; messages: UIMessage[] } = await request.json();
    const selectedChatModel = cookies.get('selected-model');

    if (!user && !allowAnonymousChats) {
        error(401, 'Unauthorized');
    }

    if (!selectedChatModel) {
        error(400, 'No chat model selected');
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
        error(400, 'No user message found');
    }

    if (user) {
        try {
            let chat: Chat;
            const chatResult = await getChatById({ id });
            
            if (chatResult.isErr()) {
                const titleResult = await generateTitleFromUserMessage({ message: userMessage });
                if (titleResult.isErr()) {
                    throw titleResult.error;
                }

                const saveResult = await saveChat({ id, userId: user.id, title: titleResult.value });
                if (saveResult.isErr()) {
                    throw saveResult.error;
                }
                chat = saveResult.value;
            } else {
                chat = chatResult.value;
            }

            if (chat.userId !== user.id) {
                error(403, 'Forbidden');
            }

            const saveMessageResult = await saveMessages({
                messages: [{
                    chatId: id,
                    id: userMessage.id,
                    role: 'user',
                    parts: userMessage.parts,
                    createdAt: new Date(),
                    attachments: [] // Add empty array or appropriate value for attachments
                }]
            });

            if (saveMessageResult.isErr()) {
                throw saveMessageResult.error;
            }
        } catch (err) {
            error(500, 'An error occurred while processing your request');
        }
    }

    const startTime = Date.now();
    const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        messages: convertToModelMessages(messages),
        system: systemPrompt({ selectedChatModel })
    });

    return result.toUIMessageStreamResponse({
        messageMetadata: ({ part }): MessageMetadata | undefined => {
            if (part.type === 'start') {
                return {
                    model: selectedChatModel,
                };
            }

            if (part.type === 'finish-step') {
                return {
                    model: selectedChatModel,
                    duration: Date.now() - startTime,
                };
            }

            if (part.type === 'finish') {
                return {
                    totalTokens: part.totalUsage?.totalTokens
                };
            }
        },
        onFinish: async ({ responseMessage }) => {
            if (!user) return;

            try {
                const saveResult = await saveMessages({
                    messages: [{
                        id: responseMessage.id,
                        chatId: id,
                        role: responseMessage.role,
                        parts: responseMessage.parts,
                        createdAt: new Date(),
                        attachments: [] // Add empty array or appropriate value for attachments
                    }]
                });

                if (saveResult.isErr()) {
                    throw saveResult.error;
                }
            } catch (err) {
                console.error('Failed to save assistant message:', err);
            }
        }
    });
}

export async function DELETE({ locals: { user }, request }) {
    if (!user) {
        error(401, 'Unauthorized');
    }

    const { id }: { id: string } = await request.json();
    
    try {
        const chatResult = await getChatById({ id });
        if (chatResult.isErr()) {
            error(404, 'Chat not found');
        }
        
        const chat = chatResult.value;
        if (chat.userId !== user.id) {
            error(403, 'Forbidden');
        }
        
        const deleteResult = await deleteChatById({ id });
        if (deleteResult.isErr()) {
            throw deleteResult.error;
        }
    } catch (err) {
        error(500, 'An error occurred while processing your request');
    }

    return new Response('Chat deleted', { status: 200 });
}
