import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
    @ApiProperty({ description: 'Title of the todo item' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Description of the todo item', required: false })
    @IsString()
    description?: string;
}
