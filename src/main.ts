import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {setupSwagger} from "./configSwagger";

const createAndSetupApp = async () => {
    const app = await NestFactory.create(AppModule, {bodyParser: true});
    setupSwagger(app);

    // Включение CORS для разработки
    app.enableCors({
        origin: '*',
    });

    return app;
}

async function bootstrap() {
    const app = await createAndSetupApp();

    await app.listen(3000);
}

bootstrap();
