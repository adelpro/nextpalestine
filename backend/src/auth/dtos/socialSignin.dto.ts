import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SocialSigninDTO {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the person',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(4, { message: 'Name must contain at least 4 characters' })
  @MaxLength(20, { message: 'Name must contain a maximum of 20 characters' })
  readonly name: string;

  @ApiProperty({
    example: 'johndoe@email.com',
    description: 'The email of the person',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
