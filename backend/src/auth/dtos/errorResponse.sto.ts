import { Provider } from '../../auth/types/providers.type';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDTO {
  @ApiProperty({
    example: 'Number',
    description: 'The response status code',
  })
  public statusCode: number;

  @ApiProperty({
    example: 'Response message',
    description: 'The response message',
  })
  public message: string;

  @ApiProperty({
    example: 'Response error',
    description: 'The response error',
  })
  public error: string;

  public provider: Provider;
  constructor(statusCode: number, message: string, error: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}
