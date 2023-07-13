import { Length, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateRaceDto {
  @Length(3, 50)
  name: string;

  @IsDateString()
  date: Date;
}

export class SubscribeRaceParticipationDto {
  @IsNotEmpty()
  race_id: string;

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  car_id: string;
}

export class UnSubscribeRaceParticipationDto {
  @IsNotEmpty()
  race_id: string;

  @IsNotEmpty()
  user_id: string;
}

export class UpdateRaceDto {
  @Length(3, 50)
  name: string;

  @IsDateString()
  date: Date;
}
