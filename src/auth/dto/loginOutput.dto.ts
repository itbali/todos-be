import {ApiProperty} from "@nestjs/swagger";

export class LoginOutputDto {
    @ApiProperty({description: 'JWT token'})
    token: string;
}