import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_PORT } from './config/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.enableCors();

  // validation pipes
  app.useGlobalPipes();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // build swagger api documnetation
  const config = new DocumentBuilder()
    .setTitle('Restaurant')
    .setVersion('1.0')
    .setDescription('Swagger API documentation for Restaurant project endpoints.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(APP_PORT);
}
bootstrap();
