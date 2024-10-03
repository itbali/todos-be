import {Body, Controller, HttpCode, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {AuthDto} from './dto/auth.dto';
import {RegisterOutputDto} from "./dto/registerOutput.dto";
import {LoginOutputDto} from "./dto/loginOutput.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({summary: 'Register a new user'})
    @ApiResponse({
        status: 201,
        description: 'User successfully registered',
        type: RegisterOutputDto
    })
    @ApiResponse({status: 409, description: 'Username already exists'})
    @Post('register')
    async register(@Body() authDto: AuthDto) {
        return this.authService.register(authDto.username, authDto.password);
    }

    @ApiOperation({summary: 'Login a user'})
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in',
        type: LoginOutputDto,
    })
    @ApiResponse({status: 401, description: 'Invalid credentials'})
    @Post('login')
    @HttpCode(200)
    async login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto.username, authDto.password);
    }
}
