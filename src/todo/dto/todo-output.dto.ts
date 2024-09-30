import {ApiProperty} from "@nestjs/swagger";

export class TodoOutputDto {
    @ApiProperty({description: 'Unique identifier of the todo item'})
    _id: string;

    @ApiProperty({description: 'Title of the todo item'})
    title: string;

    @ApiProperty({description: 'Completion status of the todo item', default: false})
    completed: boolean;

    @ApiProperty({description: 'Description of the todo item', required: false})
    description?: string;

    @ApiProperty({description: 'Date of creation', example: '2024-08-21T12:00:00Z'})
    createdAt: Date;

    @ApiProperty({description: 'Date of last update', example: '2024-08-21T12:00:00Z'})
    updatedAt: Date;
}