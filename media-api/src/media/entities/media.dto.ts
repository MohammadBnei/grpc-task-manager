import {
  Length,
  IsDefined,
  MinDate,
  IsObject,
  IsNotEmpty,
  IsDate,
  IsDateString,
  IsString,
  IsUrl,
  IsNumber,
} from 'class-validator';

export class CreateMediaDto {
  @Length(3, 50)
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  taskId: string;
}

export class ListMediasDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;
}

export class DeleteMediaDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GetMediaDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
