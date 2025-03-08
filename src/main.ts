import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogService } from './libs/log/log.service';
import { GlobalExceptionFilter } from './libs/filter/GlobalExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(new LogService());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
