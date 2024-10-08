import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {setupSwagger} from "./configSwagger";

const createAndSetupApp = async () => {
    const app = await NestFactory.create(AppModule, {bodyParser: true});
    setupSwagger(app);

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
        allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
        credentials: true,
    });

    return app;
};

async function bootstrap() {
    const app = await createAndSetupApp();

    await app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        }
    )
}

bootstrap();
