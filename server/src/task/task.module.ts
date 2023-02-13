import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entity/task.schema';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ProfanityService } from 'src/profanity/profanity.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TaskService, ProfanityService],
  controllers: [TaskController],
})
export class TaskModule {}
