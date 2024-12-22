import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // xem xet dau vao du lieu
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Exiting gracefully...');
    await app.close();
    process.exit(0); 
  });
  await app.listen(4000);
}
bootstrap();
