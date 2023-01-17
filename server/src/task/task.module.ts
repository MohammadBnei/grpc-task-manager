import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entity/task.schema';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
