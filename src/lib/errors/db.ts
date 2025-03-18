import { TaggedError } from './tagged-error';

export class DbEntityNotFoundError extends TaggedError<'DbEntityNotFoundError'> {
	readonly id: string;
	readonly entityType: string;

	constructor(id: string, entityType: string, options: ErrorOptions = {}) {
		super(`${entityType} not found: ${id}`, options);
		this.id = id;
		this.entityType = entityType;
	}
}

export class DbInternalError extends TaggedError<'DbInternalError'> {
	constructor(options: ErrorOptions = {}) {
		super('Internal error', options);
	}
}

export type DbError = DbEntityNotFoundError | DbInternalError;
