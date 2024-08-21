import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
    @ApiProperty({ description: 'Title of the todo item' })
    @Prop({ required: true })
    title: string;

    @ApiProperty({ description: 'Completion status of the todo item', default: false })
    @Prop({ default: false })
    completed: boolean;

    @ApiProperty({ description: 'User ID associated with the todo item' })
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @ApiProperty({ description: 'Date of creation', example: '2024-08-21T12:00:00Z' })
    @Prop()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update', example: '2024-08-21T12:00:00Z' })
    @Prop()
    updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
