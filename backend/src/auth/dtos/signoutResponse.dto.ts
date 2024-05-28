import { ApiProperty } from '@nestjs/swagger';

export class SignoutResponseDTO {
  @ApiProperty({
    example: '6152d24a912dcf001e3052c3',
    description: 'The Id of the logged-out user',
  })
  public id: string;

  @ApiProperty({
    example: 'Successfully signed out',
    description: 'The message of the signout request',
  })
  public message: string;

  constructor(id: string, message: string) {
    this.id = id;
    this.message = message;
  }
}
