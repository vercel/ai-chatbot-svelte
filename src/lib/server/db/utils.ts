import { DbEntityNotFoundError } from '$lib/errors/db';
import { err, ok, Result } from 'neverthrow';

export function unwrapSingleQueryResult<T>(
	rows: T[],
	id: string,
	entityType: string
): Result<T, DbEntityNotFoundError> {
	if (rows.length === 0) {
		return err(new DbEntityNotFoundError(id, entityType));
	}
	return ok(rows[0]);
}
