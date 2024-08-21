import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
    @ApiProperty({ description: 'Username for the user' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'Password for the user' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
