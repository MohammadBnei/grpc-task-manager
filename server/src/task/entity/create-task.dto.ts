import { Length, IsDefined, MinDate } from 'class-validator';

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
