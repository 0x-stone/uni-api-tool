import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SystemModule } from './system/system.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PoolService } from './pool/pool.service';
import { PoolModule } from './pool/pool.module';

@Module({
  imports: [CommonModule, SystemModule, PoolModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
