import { Module } from '@nestjs/common';
import { SearchModule } from '../search/search.module';
import { SystemController } from './system.controller';

@Module({
  imports: [SearchModule],
  controllers: [SystemController],
})
export class SystemModule {}
