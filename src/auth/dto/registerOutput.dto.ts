import {ApiProperty} from "@nestjs/swagger";

export class RegisterOutputDto {
    @ApiProperty({description: 'Unique username'})
    username: string;
}