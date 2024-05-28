import { Controller, Get, HttpCode, HttpStatus, UseGuards, Delete, Param, NotFoundException } from '@nestjs/common';
import { MyTokensResponseWithCurrentTokenDTO } from './dtos/myTokensResponseWithCurrentTokenDTO.dto';
import { AuthenticatedUser } from '@/auth/types/authenticatedUser.type';
import { CurrentUser } from '@/auth/decorators/currentUser.decorator';
import { ErrorResponseDTO } from '@/auth/dtos/errorResponse.sto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JWTAuthGuard } from '@/auth/guards/jwt.guard';
import { TokensService } from './tokens.service';
import { Token } from './schemas/token.schema';

@Controller('tokens')
@UseGuards(JWTAuthGuard)
export class TokensController {
  constructor(readonly tokenService: TokensService) {}

  @Get('/my-tokens')
  @ApiOperation({ summary: 'Get user tokens' })
  @ApiResponse({
    status: 200,
    description: 'Get all user tokens',
    type: MyTokensResponseWithCurrentTokenDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'No tokens found',
    type: ErrorResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  async getTokensByUserId(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ tokens: Token[]; currentTokenId: string | null }> {
    const tokens = await this.tokenService.getTokensByUserId(user.id);
    const CurrentToken = await this.tokenService.findTokenByValue(user.token);
    const currentTokenId = CurrentToken?._id.toString() ? CurrentToken?._id.toString() : null;
    return { tokens, currentTokenId };
  }

  @ApiOperation({ summary: 'Delete post by id' })
  @ApiResponse({
    status: 200,
    description: 'Delete token by id',
    type: Token,
  })
  @ApiResponse({
    status: 404,
    description: 'No posts found',
    type: ErrorResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete token by id' })
  @HttpCode(HttpStatus.OK)
  async deleteTokenById(@Param('id') id: string): Promise<Token> {
    const token = await this.tokenService.deleteTokenById(id);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    return token;
  }
}
