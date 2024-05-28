import { Token } from '../schemas/token.schema';
import { ApiProperty } from '@nestjs/swagger';

export class MyTokensResponseDTO {
  @ApiProperty({
    example:
      '[{id:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9, label:"Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0"},...]',
    description: 'The current user tokens.',
  })
  public tokens: Token[];
}
