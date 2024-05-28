import { IsNotEmpty, MinLength, MaxLength, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UpdatePOSTDTO {
  @ApiProperty({
    example: 'Post excerpt',
    description: 'The post title',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(4, { message: 'Title must contain at least 4 characters' })
  @MaxLength(100, { message: 'Title must contain a maximum of 100 characters' })
  title: string;

  @ApiProperty({
    example: 'Post excerpt',
    description: 'The post excerpt',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(4, { message: 'Title must contain at least 4 characters' })
  @MaxLength(100, { message: 'Title must contain a maximum of 100 characters' })
  excerpt: string;

  @ApiProperty({
    example: 'Post content',
    description: 'The post content',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(10, { message: 'Content must contain at least 10 characters' })
  @MaxLength(10000, { message: 'Content must contain a maximum of 10 000 characters' })
  content: string;

  @ApiProperty({
    example: 'true',
    description: 'Is the post published?',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdtatePOSTObjectDTO {
  @ApiProperty({ type: UpdatePOSTDTO, required: true })
  @ValidateNested()
  @Type(() => UpdatePOSTDTO)
  readonly post: UpdatePOSTDTO;
}
