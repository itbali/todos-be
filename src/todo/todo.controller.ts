import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {TodoService} from './todo.service';
import {CreateTodoDto} from './dto/create-todo.dto';
import {UpdateTodoDto} from './dto/update-todo.dto';
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import {TodoOutputDto} from "./dto/todo-output.dto";

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {
    }

    @ApiOperation({summary: 'Create a new todo item'})
    @ApiResponse({
        status: 201,
        description: 'Todo successfully created',
        type: TodoOutputDto,
    })
    @Post()
    async create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
        return this.todoService.create({
            title: createTodoDto.title,
            description: createTodoDto.description,
            userId: req.user._id
        })
    }

    @ApiOperation({summary: 'Get all todos for the logged-in user with filtering and pagination'})
    @ApiResponse({
        status: 200,
        description: 'Todos retrieved successfully',
        type: [TodoOutputDto],
    })
    @ApiQuery({name: 'completed', required: false, type: Boolean, description: 'Filter by completion status'})
    @ApiQuery({name: 'limit', required: false, type: Number, description: 'Limit the number of results'})
    @ApiQuery({name: 'page', required: false, type: Number, description: 'Page number for pagination'})
    @ApiQuery({name: 'search', required: false, type: String, description: 'Search by title'})
    @Get()
    async findAll(
        @Request() req,
        @Query('completed') completed?: boolean,
        @Query('limit') limit = 100,  // Задаем значение по умолчанию
        @Query('page') page = 1,      // Задаем значение по умолчанию
        @Query('search') search?: string,
    ) {
        const filter = {};
        if (completed !== undefined) {
            filter['completed'] = completed;
        }

        const skip = (page - 1) * limit;
        return this.todoService.findAll(req.user._id, filter, limit, skip, search);
    }

    @ApiOperation({summary: 'Get a todo by ID'})
    @ApiResponse({
        status: 200,
        description: 'Todo retrieved successfully',
        type: TodoOutputDto,
    })
    @Get(':id')
    async findById(@Param('id') id: string, @Request() req) {
        return this.todoService.findById(id, req.user._id);
    }

    @ApiOperation({summary: 'Update a todo item'})
    @ApiResponse({
        status: 200,
        description: 'Todo updated successfully',
        type: TodoOutputDto,
    })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Request() req) {
        return this.todoService.update({
            id,
            completed: updateTodoDto.completed,
            title: updateTodoDto.title,
            description: updateTodoDto.description,
            userId: req.user._id
        })
    }

    @ApiOperation({summary: 'Delete a todo item'})
    @ApiResponse({
        status: 200,
        description: 'Todo deleted successfully',
        type: TodoOutputDto,
    })
    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req) {
        return this.todoService.delete(id, req.user._id);
    }
}
