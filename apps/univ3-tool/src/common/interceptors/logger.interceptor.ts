import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IRequest } from './types';
import { LoggerService } from '../services/logger/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = new Date();
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<IRequest>();
    const uuid = req.uuid;
    this.loggerService.info(
      `--->[HTTP:REQUEST(${uuid})] [PATH]: ${req.url} [TIME]: ${now}`,
    );
    return next.handle().pipe(
      tap((value) => {
        this.loggerService.info(
          `<---[HTTP:RESPONSE(${uuid})] [PATH]: ${
            req.url
          } [TIME]: ${now} [DURATION]: ${
            Date.now() - now.valueOf()
          }ms [VALUE]: ${JSON.stringify(value)}`,
        );
      }),
    );
  }
}
