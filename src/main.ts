import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {setupSwagger} from "./configSwagger";

const createAndSetupApp = async () => {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  setupSwagger(app);

  // Включение CORS для разработки
  app.enableCors({
    origin: '*',
  });

  return app;
}

async function bootstrap() {
  const app = await createAndSetupApp();


  // Настройка Swagger
  const config = new DocumentBuilder()
      .setTitle('Todo API')
      .setDescription('API for managing todos')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
