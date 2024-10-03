import {ApiProperty} from "@nestjs/swagger";

export class RegisterOutputDto {
    @ApiProperty({description: 'ID of the user'})
    _id: string;

    @ApiProperty({description: 'Unique username'})
    username: string;
}