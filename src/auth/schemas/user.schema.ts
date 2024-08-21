import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
    @ApiProperty({ description: 'Unique username' })
    @Prop({ required: true, unique: true })
    username: string;

    @ApiProperty({ description: 'Hashed password' })
    @Prop({ required: true })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
