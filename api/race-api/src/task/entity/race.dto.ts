import {
  Length,
  IsDefined,
  MinDate,
  IsObject,
  IsNotEmpty,
  IsDate,
  IsDateString,
} from 'class-validator';

export class CreateRaceDto {
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
  raceName: string;

  @IsNotEmpty()
  fieldName: string;

  @IsNotEmpty()
  fieldValue: string;
}

export class UpdateRaceDto {
  @IsObject()
  fields!: any;

  @MinDate(() => new Date())
  dueDate: Date;
}
