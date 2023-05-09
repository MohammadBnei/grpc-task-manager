import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FieldsArray, Task, TaskDocument } from './entity/task.schema';
import { CreateTaskDto, UpdateTaskDto } from './entity/task.dto';
import { Task as TaskPb } from '../stubs/task/v1beta/message';
@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  toTaskPb(task: Task): TaskPb {
    return {
      name: task.name,
      fields: task.fieldsArray,
      dueDate: task.dueDate.toISOString(),
      done: task.done,
      id: `${task._id}`,
    };
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const createdTask = new this.taskModel(createTaskDto);
      return await createdTask.save();
    } catch (error) {
      if ((error?.message as string)?.includes('E11000')) {
        throw new Error(`${createTaskDto.name} name is taken`);
      }
    }
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async find(id: string | number, name: string) {
    const task = await this.taskModel.findOne({ id, name });

    if (!task) {
      throw new Error(`task with id ${id} or name ${name} not found`);
    }

    return task;
  }

  async addField(taskName: string, ...fields: FieldsArray) {
    const task = await this.find('', taskName);

    task.fieldsArray = fields;

    await task.save();

    return task;
  }

  async deleteField(taskName: string, fieldName: string) {
    const task = await this.find('', taskName);

    task.fields.delete(fieldName);

    await task.save();

    return task;
  }

  async updateTask(
    { id, name }: { name?: string; id?: string },
    uTask: UpdateTaskDto,
  ): Promise<Task> {
    let task: TaskDocument;
    if (id) {
      task = await this.taskModel.findById(id);
    } else {
      task = await this.taskModel.findOne({ name });
    }

    if (!task) {
      throw new Error(`task with id ${id} or name ${name} not found`);
    }

    Object.assign(task, uTask);

    await task.save();
    return task;
  }

  async deleteTask(id: number | string) {
    const task = await this.taskModel.findOneAndDelete({
      name: { $regex: `^${id}$`, $options: 'i' },
    });

    if (!task) {
      throw new Error(`task with name ${id} not found`);
    }

    return task;
  }
}
