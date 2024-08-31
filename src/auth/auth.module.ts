import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {User, UserSchema} from './schemas/user.schema';
import {JwtStrategy} from './jwt.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        PassportModule,
        JwtModule.register({
            secret: 'secretKey', // Лучше хранить в .env файле
            signOptions: {expiresIn: '60m'},
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {
}
