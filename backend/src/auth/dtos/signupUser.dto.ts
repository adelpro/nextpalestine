import { IsNotEmpty, IsEmail, MinLength, Matches, IsNotIn, MaxLength, ValidateNested } from 'class-validator';
import { IsUser } from '../decorators/isUser.validation.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
class SignupDTO {
  @ApiProperty({
    example: 'JohnDoe',
    description: 'The name of the person',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(4, { message: 'Name must contain at least 4 characters' })
  @MaxLength(20, { message: 'Name must contain a maximum of 20 characters' })
  name: string;

  @ApiProperty({
    example: 'johndoe@email.com',
    description: 'The email of the person',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'The password of the person',
    required: true,
  })
  @MinLength(8, {
    message: 'Password must contain at least 8 characters',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number',
  })
  @IsNotIn(['password', '123456', '123456789', 'qwerty', 'azerty', 'qwerty123', 'azerty123', 'abc123'], {
    message: 'This password is too common. Please choose a stronger password.',
  })
  // Can't make it readonly because we have to hach it before saving to the database
  password: string;
}
export class SignupUserDTO {
  @ApiProperty({ type: SignupDTO })
  @IsUser()
  @ValidateNested()
  @Type(() => SignupDTO)
  readonly user: SignupDTO;
}
