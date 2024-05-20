import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { DeleteResult } from 'typeorm';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiCreatedResponse({
    description: 'List of tasks',
    type: Task,
    isArray: true,
  })
  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiCreatedResponse({
    description: 'Task details',
    type: Task,
  })
  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiCreatedResponse({
    description: 'Task deleted successfully',
  })
  @Delete('/:id')
  deleteTask(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResult> {
    return this.tasksService.deleteTask(id, user);
  }

  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    type: Task,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @ApiOperation({ summary: 'Update a task status by ID' })
  @ApiCreatedResponse({
    description: 'Task status updated successfully',
    type: Task,
  })
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
