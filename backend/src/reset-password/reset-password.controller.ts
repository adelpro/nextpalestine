import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailerService } from '@/mailer/mailer.service';
import { Response } from 'express';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(
    private readonly resetPasswordService: ResetPasswordService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send reset password email',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password email sent successfully',
  })
  async sendResetPasswordEmail(@Body('email') email: string): Promise<{ message: string }> {
    await this.mailerService.sendResetPasswordEmail(email);
    return { message: 'Reset password email sent successfully' };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password using the token',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password successfully',
  })
  async resetPassword(@Body() data: { token: string; password: string }, @Res() response: any): Promise<Response<any>> {
    const { password, token } = data;
    const message = await this.resetPasswordService.resetPassword(token, password);
    return response.status(HttpStatus.OK).json(message);
  }
}
