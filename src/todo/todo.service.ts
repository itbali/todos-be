import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Todo, TodoDocument} from './schemas/todo.schema';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {
    }

    async create({description, userId, title}:{title: string, description?: string, userId: string}): Promise<Todo> {
        const newTodo = new this.todoModel({title, description, user: userId});
        const todo = await newTodo.save();
        return todo.toObject({
            versionKey: false, transform: (_doc, ret) => {
                delete ret.user;
                return ret;
            }
        });
    }

    async findAll(userId: string, filter?: any, limit?: number, skip?: number): Promise<Todo[]> {
        return this.todoModel
            .find({user: userId, ...filter})
            .limit(limit)
            .skip(skip)
            .select('-__v -user');
    }

    async findById(id: string, userId: string): Promise<Todo> {
        return this.todoModel
            .findById(id)
            .where({user: userId})
            .select('-__v -user');
    }

    async findByTitle(title: string, userId: string): Promise<Todo[]> {
        return this.todoModel
            .find({title: {$regex: title, $options: 'i'}, user: userId})
            .select('-__v -user');
    }

    async update({id, description, completed, userId, title}:{id: string, completed?: boolean, userId: string, title?:string, description?:string}): Promise<Todo> {
        return this.todoModel
            .findOneAndUpdate(
                {_id: id, user: userId},
                {completed, description, title},
                {new: true})
            .select('-__v -user');
    }

    async delete(id: string, userId: string): Promise<Todo> {
        return this.todoModel
            .findOneAndDelete({_id: id, user: userId})
            .select('-__v -user');
    }
}
