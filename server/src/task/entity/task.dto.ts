import { Length, IsDefined, MinDate, IsObject } from 'class-validator';

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

export class UpdateTaskDto {
  id: string | number;

  @IsObject()
  fields!: any;

  @Length(3, 50)
  name!: string;
}
