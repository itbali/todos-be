import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Todo, TodoDocument} from './schemas/todo.schema';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {
    }

    async create(title: string, userId: string): Promise<Todo> {
        const newTodo = new this.todoModel({title, user: userId});
        return newTodo.save();
    }

    async findAll(userId: string, filter?: any, limit?: number, skip?: number): Promise<Todo[]> {
        return this.todoModel
            .find({user: userId, ...filter})
            .limit(limit)
            .skip(skip)
            .select('-__v -user');
    }

    async update(id: string, completed: boolean, userId: string): Promise<Todo> {
        return this.todoModel
            .findOneAndUpdate(
                {_id: id, user: userId},
                {completed},
                {new: true})
            .select('-__v -user');
    }

    async delete(id: string, userId: string): Promise<Todo> {
        return this.todoModel
            .findOneAndDelete({_id: id, user: userId})
            .select('-__v -user');
    }
}
