import {
  Length,
  IsDefined,
  MinDate,
  IsObject,
  IsNotEmpty,
  IsDate,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @Length(3, 50)
  name: string;

  @IsDateString()
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
