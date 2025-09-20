/**
 * Generic web response shape used by controllers/services for simple responses.
 * Prefer interfaces for lightweight type declarations across the codebase.
 */
export interface WebResponse<T = unknown> {
  data?: T;
  errors?: string;
}
