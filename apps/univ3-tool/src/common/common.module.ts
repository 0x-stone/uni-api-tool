import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AcrossDomainInterceptor } from './interceptors/across-domain.interceptor';
import { DataWrapInterceptor } from './interceptors/data-wrap.interceptor';
// import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { EnvService } from './services/env/env.service';
import { LoggerService } from './services/logger/logger.service';
import { MetadataTransformService } from './services/metadata-transform/metadata-transform.service';

@Global()
@Module({
  providers: [
    EnvService,
    LoggerService,
    MetadataTransformService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataWrapInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggerInterceptor,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: AcrossDomainInterceptor,
    },
  ],
  exports: [EnvService, LoggerService, MetadataTransformService],
})
export class CommonModule {}
