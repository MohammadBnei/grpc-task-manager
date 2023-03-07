import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @Length(4, 64)
  password: string;
  @Length(2, 64)
  firstName: string;
  @Length(2, 64)
  lastName: string;
}
