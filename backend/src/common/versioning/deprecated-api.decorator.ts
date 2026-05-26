import { SetMetadata } from '@nestjs/common';

export const DEPRECATED_API_METADATA_KEY = 'niffy:deprecated_api';

/** Marks a controller or route handler as deprecated (adds Deprecation + Sunset headers). */
export const DeprecatedApi = () => SetMetadata(DEPRECATED_API_METADATA_KEY, true);
