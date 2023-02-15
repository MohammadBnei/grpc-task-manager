import {
  Length,
  IsDefined,
  MinDate,
  IsObject,
  IsNotEmpty,
} from 'class-validator';

export class CreateTaskDto {
  @Length(3, 50)
  name: string;

  @MinDate(() => new Date())
  dueDate: Date;
}

export class CreateFieldsDto {
  @IsDefined()
  fields: any;
}
export class AddFieldDto {
  @IsNotEmpty()
  taskName: string;

  @IsNotEmpty()
  fieldName: string;

  @IsNotEmpty()
  fieldValue: string;
}

export class UpdateTaskDto {
  @IsObject()
  fields!: any;

  @MinDate(() => new Date())
  dueDate: Date;
}

export interface ITask {
  name: string;
  dueDate: Date;
  fields: Record<string, string>;
}
