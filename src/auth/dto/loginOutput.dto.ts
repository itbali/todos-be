import {ApiProperty} from "@nestjs/swagger";

export class LoginOutputDto {
    @ApiProperty({description: 'JWT token'})
    access_token: string;
    @ApiProperty({description: 'Username'})
    username: string;
}