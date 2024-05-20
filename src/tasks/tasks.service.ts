import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { DeleteResult } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { TasksGateway } from './tasks.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    private tasksGateway: TasksGateway, // Inject TasksGateway
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id }, // Corrected the where clause to include the task ID
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async deleteTask(id: number, user: User): Promise<DeleteResult> {
    const deleteResult = await this.taskRepository.delete({
      id,
      userId: user.id,
    });

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    this.tasksGateway.sendTaskDeletedEvent(id); // Broadcast event
    return deleteResult;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    this.tasksGateway.sendTaskUpdatedEvent(task); // Broadcast event
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = await this.taskRepository.createTask(createTaskDto, user);
    this.tasksGateway.sendTaskCreatedEvent(task); // Broadcast event
    return task;
  }
}
