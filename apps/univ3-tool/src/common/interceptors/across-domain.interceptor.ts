import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AcrossDomainInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const req = context.switchToHttp().getRequest();
        req.res.header('Access-Control-Allow-Origin', 'www.bybit.com');
        req.res.header('Access-Control-Allow-Credentials', true);
        return data;
      }),
    );
  }
}
