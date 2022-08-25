import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AcrossDomainInterceptor } from './interceptors/across-domain.interceptor';
import { DataWrapInterceptor } from './interceptors/data-wrap.interceptor';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { EnvService } from './services/env/env.service';
import { LoggerService } from './services/logger/logger.service';

@Global()
@Module({
  providers: [
    EnvService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataWrapInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AcrossDomainInterceptor,
    },
  ],
  exports: [EnvService, LoggerService],
})
export class CommonModule {}
