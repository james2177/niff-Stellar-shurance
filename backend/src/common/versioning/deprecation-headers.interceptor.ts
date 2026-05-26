import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  DEPRECATION_HEADER,
  DEPRECATED_API_SUNSET_HTTP_DATE,
  SUNSET_HEADER,
} from './api-versioning.constants';
import { DEPRECATED_API_METADATA_KEY } from './deprecated-api.decorator';

@Injectable()
export class DeprecationHeadersInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isDeprecated =
      this.reflector.getAllAndOverride<boolean>(DEPRECATED_API_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) === true;

    if (!isDeprecated) {
      return next.handle();
    }

    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        res.setHeader(DEPRECATION_HEADER, 'true');
        res.setHeader(SUNSET_HEADER, DEPRECATED_API_SUNSET_HTTP_DATE);
      }),
    );
  }
}
