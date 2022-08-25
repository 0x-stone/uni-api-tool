import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import * as path from 'path';

const isDev = process.env.ENV === 'dev';
const isProd = process.env.ENV === 'prod';

function initEnvVars() {
  const envPath = isDev ? './env/dev.conf' : './.env';
  const ENV = dotenv.config({
    path: path.resolve(process.cwd(), envPath),
  });
  if (!isProd) {
    console.log(ENV.parsed);
  }
}
initEnvVars();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8901);
}
bootstrap();
