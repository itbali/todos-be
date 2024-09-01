import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {setupSwagger} from "./configSwagger";

const createAndSetupApp = async () => {
    const app = await NestFactory.create(AppModule, {bodyParser: true});
    setupSwagger(app);

    // Включение CORS для разработки
    app.enableCors((req, callback) => {
        const corsOptions = {
            origin: false,
            methods: '',
            allowedHeaders: '',
            credentials: false,
        };

        const whitelist = ['http://localhost:3000', 'http://localhost:5173'];
        const origin = req.header('Origin');

        if (whitelist.includes(origin) || origin.includes('vercel.app')) {
            corsOptions.origin = true;
            corsOptions.methods = 'GET,HEAD,PUT,PATCH,POST,DELETE';
            corsOptions.allowedHeaders = 'Content-Type, Accept, Authorization';
            corsOptions.credentials = true;
        }
        callback(null, corsOptions);
    });

    return app;
};

async function bootstrap() {
    const app = await createAndSetupApp();

    await app.listen(3000);
}

bootstrap();
