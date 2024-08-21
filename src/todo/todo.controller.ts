import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @ApiOperation({ summary: 'Create a new todo item' })
    @ApiResponse({ status: 201, description: 'Todo successfully created' })
    @Post()
    async create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
        return this.todoService.create(createTodoDto.title, req.user._id);
    }

    @ApiOperation({ summary: 'Get all todos for the logged-in user with filtering and pagination' })
    @ApiResponse({ status: 200, description: 'Todos retrieved successfully' })
    @Get()
    async findAll(
        @Request() req,
        @Query('completed') completed?: boolean,
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1
    ) {
        const filter = {};
        if (completed !== undefined) {
            filter['completed'] = completed;
        }

        const skip = (page - 1) * limit;
        return this.todoService.findAll(req.user._id, filter, limit, skip);
    }

    @ApiOperation({ summary: 'Update a todo item' })
    @ApiResponse({ status: 200, description: 'Todo updated successfully' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Request() req) {
        return this.todoService.update(id, updateTodoDto.completed, req.user._id);
    }

    @ApiOperation({ summary: 'Delete a todo item' })
    @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req) {
        return this.todoService.delete(id, req.user._id);
    }
}
