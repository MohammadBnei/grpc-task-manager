import { IsAlpha } from 'class-validator';

export class UpdateUserDto {
  @IsAlpha()
  firstName?: string;
  @IsAlpha()
  lastName?: string;
}
