import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';
import {User, UserDocument} from './schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) {
    }

    async register(username: string, password: string): Promise<User> {
        const existingUser = await this.userModel.findOne({username}).exec();
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({username, password: hashedPassword});
        const user = await newUser.save();
        return user.toObject({
            versionKey: false, transform: (_doc, ret) => {
                delete ret.password;
                return ret;
            }
        });
    }

    async login(username: string, password: string): Promise<{ access_token: string }> {
        const user = await this.userModel.findOne({username}).exec();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {username: user.username, sub: user._id};
        return {
            access_token: this.jwtService.sign(payload, {expiresIn: '1d'}),
        };
    }

    async validateUser(userId: string): Promise<User> {
        return this.userModel.findById(userId).exec();
    }
}
