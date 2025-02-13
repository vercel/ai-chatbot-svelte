import { TaggedError } from '../tagged-error';

export class DbInternalError extends TaggedError<'InternalError'> {
	constructor(options: ErrorOptions = {}) {
		super('Internal error', options);
	}
}
