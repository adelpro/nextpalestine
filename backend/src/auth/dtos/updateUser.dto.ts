import { IsEmail, IsOptional, MinLength, MaxLength, ValidateNested, IsString } from 'class-validator';
import { IsUser } from '../decorators/isUser.validation.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
class UpdateDTO {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the person',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'Name must contain at least 4 characters' })
  @MaxLength(20, { message: 'Name must contain a maximum of 20 characters' })
  name: string;

  @ApiProperty({
    example: 'johndoe@email.com',
    description: 'The name of the person',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: 'Web Developer',
    description: 'About the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  about: string;
}

export class UpdateUserDTO {
  @IsUser()
  @ValidateNested()
  @Type(() => UpdateDTO)
  readonly user: UpdateDTO;
}
