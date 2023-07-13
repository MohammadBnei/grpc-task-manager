import {
  Length,
  IsDefined,
  MinDate,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateRaceDto {
  @Length(3, 50)
  name: string;

  @IsDateString()
  date: Date;
}

export class CreateFieldsDto {
  @IsDefined()
  fields: any;
}
export class RegisterParticipationDto {
  @IsNotEmpty()
  raceId: string;

  @IsNotEmpty()
  fieldName: string;

  @IsNotEmpty()
  fieldValue: string;
}

export class UpdateRaceDto {
  @Length(3, 50)
  name: string;

  @IsDateString()
  date: Date;
}
