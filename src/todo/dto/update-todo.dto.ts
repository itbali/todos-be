import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional} from 'class-validator';

export class UpdateTodoDto {
    @ApiProperty({description: 'Completion status of the todo item', required: false})
    @IsBoolean()
    @IsOptional()
    completed?: boolean;

    @ApiProperty({description: 'Title of the todo item', required: false})
    @IsOptional()
    title?: string;

    @ApiProperty({description: 'Description of the todo item', required: false})
    @IsOptional()
    description?: string;
}
