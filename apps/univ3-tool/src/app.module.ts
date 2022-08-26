import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SystemModule } from './system/system.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PoolService } from './pool/pool.service';

@Module({
  imports: [CommonModule, SystemModule],
  controllers: [AppController],
  providers: [AppService, PoolService],
})
export class AppModule {}
