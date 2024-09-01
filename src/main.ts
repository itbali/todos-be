import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {setupSwagger} from "./configSwagger";

const createAndSetupApp = async () => {
    const app = await NestFactory.create(AppModule, {bodyParser: true});
    setupSwagger(app);

    // Включение CORS для разработки
    app.enableCors({
        origin: (origin, callback) => {

            console.log('origin:', origin);
            const allowed = !origin || origin.includes("localhost") || origin.includes('vercel.app');
            if (allowed) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });

    return app;
};

async function bootstrap() {
    const app = await createAndSetupApp();

    await app.listen(3000);
}

bootstrap();
