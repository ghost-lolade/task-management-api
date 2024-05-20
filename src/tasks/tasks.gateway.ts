import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@WebSocketGateway({ namespace: '/tasks' })
@UseGuards(AuthGuard())
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tasksService: TasksService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getTasks')
  async handleGetTasks(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { filterDto, user } = data;
    const tasks = await this.tasksService.getTasks(filterDto, user);
    client.emit('tasks', tasks);
  }

  @SubscribeMessage('getTaskById')
  async handleGetTaskById(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { id, user } = data;
    const task = await this.tasksService.getTaskById(id, user);
    client.emit('task', task);
  }

  @SubscribeMessage('createTask')
  async handleCreateTask(
    @MessageBody() data: any,
    // @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { createTaskDto, user } = data;
    const task = await this.tasksService.createTask(createTaskDto, user);
    this.server.emit('taskCreated', task); // Notify all clients about the new task
  }

  @SubscribeMessage('deleteTask')
  async handleDeleteTask(
    @MessageBody() data: any,
    // @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { id, user } = data;
    const result = await this.tasksService.deleteTask(id, user);
    this.server.emit('taskDeleted', { id, result }); // Notify all clients about the deleted task
  }

  @SubscribeMessage('updateTaskStatus')
  async handleUpdateTaskStatus(
    @MessageBody() data: any,
    // @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { id, status, user } = data;
    const task = await this.tasksService.updateTaskStatus(id, status, user);
    this.server.emit('taskUpdated', task); // Notify all clients about the updated task
  }

  // Methods to broadcast events
  sendTaskCreatedEvent(task: Task) {
    this.server.emit('taskCreated', task);
  }

  sendTaskDeletedEvent(id: number) {
    this.server.emit('taskDeleted', { id });
  }

  sendTaskUpdatedEvent(task: Task) {
    this.server.emit('taskUpdated', task);
  }
}
