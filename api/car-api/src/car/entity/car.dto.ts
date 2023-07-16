import { Length } from 'class-validator';

export class CreateCarDto {
  @Length(1, 50)
  brand: string;

  @Length(1, 50)
  model: string;
}

export class UpdateCarDto {
  @Length(1, 50)
  brand: string;

  @Length(1, 50)
  model: string;
}
