import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../services/logger/logger.service';
import { IRequest } from './types';

@Injectable()
export class DataWrapInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<IRequest>();
    req.uuid = uuidv4();
    return next.handle().pipe(
      map((data) => ({
        ret_code: 0,
        ret_msg: '',
        result: data,
      })),
      catchError((err: any) => {
        this.loggerService.error(err);
        const errorMsg =
          (err.response && err.response.error) || (err && err.message);
        return of({ ret_code: -1, ret_msg: errorMsg, data: '' });
      }),
    );
  }
}
