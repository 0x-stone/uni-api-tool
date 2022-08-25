import { NestFactory } from '@nestjs/core';
import { PoolStatusModule } from './pool-status.module';

async function bootstrap() {
  const app = await NestFactory.create(PoolStatusModule);
  await app.listen(3000);
}
bootstrap();
