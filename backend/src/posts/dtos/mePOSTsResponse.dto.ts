import { POST } from '../schemas/post.schema';
import { ApiProperty } from '@nestjs/swagger';

export class MePOSTsResponseDTO {
  @ApiProperty({
    example:
      '[{id:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9, title:"post title", excerpt:"post excerpt", content:"post content", publishedAt:2022-01-01T00:00:00.000Z},...]',
    description: 'The current user posts.',
  })
  public posts: POST[];
}
