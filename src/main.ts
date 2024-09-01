import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {setupSwagger} from "./configSwagger";

const createAndSetupApp = async () => {
    const app = await NestFactory.create(AppModule, {bodyParser: true});
    setupSwagger(app);

    // Включение CORS для разработки
    app.enableCors({
        origin: (origin, callback) => {
            const whitelist = ['http://localhost:3000', 'http://localhost:5173'];

            console.log('origin', origin);
            const allowed = !origin || whitelist.includes(origin) || origin.includes('vercel.app');
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
