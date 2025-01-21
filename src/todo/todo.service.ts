import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create({
    description,
    userId,
    title,
  }: {
    title: string;
    description?: string;
    userId: string;
  }): Promise<Todo> {
    const lastTodoOrder = await this.todoModel
      .findOne({ user: userId })
      .sort({ order: -1 })
      .select('order');

    const order = lastTodoOrder ? lastTodoOrder.order + 1 : 0;
    const newTodo = new this.todoModel({
      title,
      description,
      user: userId,
      order,
    });
    const todo = await newTodo.save();
    return todo.toObject({
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret.user;
        return ret;
      },
    });
  }

  async findAll(
    userId: string,
    filter?: any,
    limit?: number,
    skip?: number,
    search?: string,
  ): Promise<Todo[]> {
    return this.todoModel
      .find({
        user: userId,
        ...filter,
        ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
      })
      .limit(limit)
      .skip(skip)
      .select('-__v -user');
  }

  async findById(id: string, userId: string): Promise<Todo> {
    return this.todoModel
      .findById(id)
      .where({ user: userId })
      .select('-__v -user');
  }

  async update({
    id,
    description,
    completed,
    userId,
    title,
    order,
  }: {
    id: string;
    completed?: boolean;
    userId: string;
    title?: string;
    description?: string;
    order?: number;
  }): Promise<Todo> {
    const updated = await this.todoModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        { completed, description, title, order },
        { new: true },
      )
      .select('-__v -user');

    // move other todos order after updated if order changed
    if (order !== undefined) {
      await this.todoModel.updateMany(
        {
          user: userId,
          _id: { $ne: id },
          order: { $gte: order },
        },
        { $inc: { order: 1 } },
      );
    }

    return updated;
  }

  async delete(id: string, userId: string): Promise<Todo> {
    const deleted = await this.todoModel
      .findOneAndDelete({ _id: id, user: userId })
      .select('-__v -user');

    // move other todos order after deleted
    const deletedTodo = deleted.toObject();
    await this.todoModel.updateMany(
      { user: userId, order: { $gt: deletedTodo.order } },
      { $inc: { order: -1 } },
    );

    return deletedTodo;
  }
}
