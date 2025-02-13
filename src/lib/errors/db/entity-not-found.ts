import { TaggedError } from '../tagged-error';

export class DbEntityNotFoundError extends TaggedError<'EntityNotFoundError'> {
	readonly id: string;
	readonly entityType: string;

	constructor(id: string, entityType: string, options: ErrorOptions = {}) {
		super(`${entityType} not found: ${id}`, options);
		this.id = id;
		this.entityType = entityType;
	}
}
