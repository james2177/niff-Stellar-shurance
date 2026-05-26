import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

/** Paths that remain reachable without a /api/v{n} prefix (docs, probes). */
const VERSION_NEUTRAL_PREFIXES = ['/docs', '/openapi.json'];

@Injectable()
export class RejectUnversionedApiMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    if (process.env.NODE_ENV !== 'production') {
      next();
      return;
    }

    const path = req.path;

    if (VERSION_NEUTRAL_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
      next();
      return;
    }

    if (path.startsWith('/api/') && !/^\/api\/v\d+(\/|$)/.test(path)) {
      res.status(404).json({
        statusCode: 404,
        message: 'Not Found',
        error: 'Not Found',
      });
      return;
    }

    next();
  }
}
