import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './entity/task.schema';
import { CreateTaskDto, UpdateTaskDto } from './entity/task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async find(id: string | number, name: string): Promise<Task> {
    const task = await this.taskModel.findOne({ id, name });

    if (!task) {
      throw new Error(`task with id ${id} or name ${name} not found`);
    }

    return task;
  }

  async updateTask(id: number | string, uTask: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new Error(`task with id ${id} not found`);
    }

    Object.assign(task, uTask);

    return task.save();
  }

  async deleteTask(id: number | string): Promise<void> {
    const task = await this.taskModel.findOneAndDelete({ id });

    if (!task) {
      throw new Error(`task with id ${id} not found`);
    }
  }
}
