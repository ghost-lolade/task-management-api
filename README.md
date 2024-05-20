# Task Management API

This project is a Task Management API built with NestJS. It includes user authentication using JWT, CRUD operations for tasks, real-time updates using WebSockets, and comprehensive API documentation using Swagger.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Database Configuration](#database-configuration)
- [Swagger API Documentation](#swagger-api-documentation)
- [Technologies Used](#technologies-used)

## Features

- User authentication with JWT
- CRUD operations for tasks
- Real-time task updates using WebSockets
- API documentation with Swagger

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ghost-lolade/task-management-api.git
    cd task-management-api
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add your database connection details and JWT secret key.
    ```env
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USERNAME=your_username
    DATABASE_PASSWORD=your_password
    DATABASE_NAME=task_management_db
    JWT_SECRET=your_jwt_secret
    ```

## Running the Application

1. Start the application:
    ```bash
    npm run start:dev
    ```

2. The application will be running at `http://localhost:3000`.

## API Endpoints

### Authentication

#### Sign Up
- **URL:** `/auth/signup`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
- **Responses:**
    - `201`: User successfully signed up.
    - `400`: Bad Request.

#### Sign In
- **URL:** `/auth/signin`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
- **Responses:**
    - `200`: Returns JWT token.
    - `401`: Unauthorized.

### Tasks

#### Create Task
- **URL:** `/tasks`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
      "title": "string",
      "description": "string"
    }
    ```
- **Responses:**
    - `201`: Task successfully created.
    - `400`: Bad Request.

#### Get All Tasks
- **URL:** `/tasks`
- **Method:** `GET`
- **Responses:**
    - `200`: Returns a list of tasks.

#### Get Task by ID
- **URL:** `/tasks/:id`
- **Method:** `GET`
- **Responses:**
    - `200`: Returns the task.
    - `404`: Task not found.

#### Update Task
- **URL:** `/tasks/:id`
- **Method:** `PATCH`
- **Request Body:**
    ```json
    {
      "title": "string",
      "description": "string",
      "status": "string"
    }
    ```
- **Responses:**
    - `200`: Task successfully updated.
    - `404`: Task not found.

#### Delete Task
- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **Responses:**
    - `200`: Task successfully deleted.
    - `404`: Task not found.

## WebSocket Events

### Task Created
- **Event:** `taskCreated`
- **Description:** Emitted when a new task is created.
- **Payload:**
    ```json
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "status": "string"
    }
    ```

## Database Configuration

Configure your database connection in the `app.module.ts` file:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './tasks/task.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TaskModule,
    AuthModule,
  ],
})
export class AppModule {}
```

## Swagger API Documentation

Swagger documentation is available at http://localhost:3000/api. It provides detailed information about each endpoint, including request parameters and response formats.

## Technology Used

- NestJs
- TypeScript
- TypeORM
- PostgreSQL
- JWT for Authentication
- WebSockets with Socket.IO
- Swagger for API documentation
