/** URI version segment for the public REST API (e.g. /api/v1/...). */
export const API_VERSION = '1';

/** RFC 8594 Deprecation response header name. */
export const DEPRECATION_HEADER = 'Deprecation';

/** RFC 8594 Sunset response header name (HTTP-date). */
export const SUNSET_HEADER = 'Sunset';

/**
 * Sunset instant for routes marked @DeprecatedApi().
 * Update when removing deprecated handlers.
 */
export const DEPRECATED_API_SUNSET_HTTP_DATE = 'Sat, 01 Nov 2026 00:00:00 GMT';

/** ISO-8601 date for docs and config references. */
export const DEPRECATED_API_SUNSET_ISO_DATE = '2026-11-01';
