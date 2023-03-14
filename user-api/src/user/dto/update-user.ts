import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    email: string;
    @Length(2, 64)
    firstName: string;
    @Length(2, 64)
    lastName: string;
}
