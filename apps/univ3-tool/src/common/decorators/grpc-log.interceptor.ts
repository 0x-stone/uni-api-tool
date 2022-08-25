import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../services/logger/logger.service';

export function GrpcLogInterceptor() {
  return applyDecorators(
    UseInterceptors(new LoggerInterceptor(new LoggerService())),
  );
}

class LoggerInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = new Date();
    const rpc = context.switchToRpc();
    const data$ = rpc.getData<Observable<any>>();
    const uuid = uuidv4();
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;
    const subscription = data$.subscribe((data) => {
      this.loggerService.info(
        `--->[RPC:REQUEST(${uuid})] [PATH]: ${controllerName}/${handlerName}  [TIME]: ${now} [VALUE]: ${JSON.stringify(
          data,
        )}`,
      );
      subscription.unsubscribe();
    });

    return next.handle().pipe(
      tap((data) => {
        this.loggerService.info(
          `<---[RPC:RESPONSE(${uuid})] [PATH]: ${controllerName}/${handlerName} [TIME]: ${now} [DURATION]: ${
            Date.now() - now.valueOf()
          }ms [VALUE]: ${JSON.stringify(data)}`,
        );
      }),
    );
  }
}
