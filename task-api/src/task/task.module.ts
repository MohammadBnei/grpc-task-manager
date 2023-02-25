import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entity/task.schema';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ProfanityService } from 'src/profanity/profanity.service';
import { FieldController } from './field.controller';
import { StreamsService } from 'src/streams/streams.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TaskService, ProfanityService, StreamsService],
  controllers: [TaskController, FieldController],
})
export class TaskModule {}
