import type { DbEntityNotFoundError } from './entity-not-found';
import type { DbInternalError } from './internal-error';

export type DbError = DbEntityNotFoundError | DbInternalError;
