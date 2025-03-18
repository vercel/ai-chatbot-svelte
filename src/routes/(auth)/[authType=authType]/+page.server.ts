import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/auth/index.js';
import { createAuthUser, getAuthUser } from '$lib/server/db/queries.js';
import type { AuthUser } from '$lib/server/db/schema.js';
import { fail, redirect } from '@sveltejs/kit';
import { compare } from 'bcrypt-ts';
import { err, ok, safeTry } from 'neverthrow';
import { z } from 'zod';

export function load({ locals }) {
	if (locals.session) {
		return redirect(307, '/');
	}
}

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

export const actions = {
	default: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const rawEmail = formData.get('email');
		const email = emailSchema.safeParse(rawEmail);
		if (!email.success) {
			return fail(400, {
				success: false,
				message: 'Invalid email',
				email: (rawEmail ?? undefined) as string | undefined
			} as const);
		}
		const password = passwordSchema.safeParse(formData.get('password'));
		if (!password.success) {
			return fail(400, { success: false, message: 'Invalid password' } as const);
		}

		const actionResult = safeTry(async function* () {
			let user: AuthUser;
			if (params.authType === 'signup') {
				user = yield* createAuthUser(email.data, password.data);
			} else {
				user = yield* getAuthUser(email.data);
				const passwordIsCorrect = await compare(password.data, user.password);
				if (!passwordIsCorrect) {
					return err(undefined);
				}
			}

			const token = generateSessionToken();
			const session = yield* createSession(token, user.id);
			setSessionTokenCookie(cookies, token, session.expiresAt);
			return ok(undefined);
		});

		return actionResult.match(
			() => redirect(303, '/'),
			() =>
				fail(400, {
					success: false,
					message: `Failed to ${params.authType === 'signup' ? 'sign up' : 'sign in'}. Please try again later.`
				})
		);
	}
};
