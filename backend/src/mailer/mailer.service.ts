import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MailerService {
  private readonly registrationEmailTemplate: string;
  private readonly activationEmailTemplate: string;
  private readonly resetPasswordEmailTemplate: string;
  private readonly OTPEmailTemplate: string;

  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const registrationTemplatePath = path.join(__dirname, 'templates', '/registration.email.template.html');
    const activationTemplatePath = path.join(__dirname, 'templates', '/activation.email.template.html');
    const resetPasswordTemplatePath = path.join(__dirname, 'templates', '/reset.password.email.template.html');
    const OTPEmailTemplatePath = path.join(__dirname, 'templates', '/otp.email.template.html');
    this.registrationEmailTemplate = fs.readFileSync(registrationTemplatePath, 'utf-8').toString();
    this.activationEmailTemplate = fs.readFileSync(activationTemplatePath, 'utf-8').toString();
    this.resetPasswordEmailTemplate = fs.readFileSync(resetPasswordTemplatePath, 'utf-8').toString();
    this.OTPEmailTemplate = fs.readFileSync(OTPEmailTemplatePath, 'utf-8').toString();
  }

  sendRegistrationEmail(email: string, name: string, password: string): void {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('EMAIL_APP_SPECIFIC_PASS'),
      },
    });
    const mailOptions = {
      from: this.configService.get<string>('EMAIL'),
      to: email,
      subject: `Welcome ${name} to ${this.configService.get<string>('APP_NAME')}`,
      html: this.registrationEmailTemplate
        .replace(/{{APP_NAME}}/g, `${this.configService.get<string>('APP_NAME')}`)
        .replace(/{{name}}/g, name)
        .replace(/{{email}}/g, email)
        .replace(/{{password}}/g, password),
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Registration email sent: ' + JSON.stringify(info));
      }
    });
  }

  async sendActivationEmail(id: string, email: string, name: string): Promise<{ messageId: string } | void> {
    const activationToken = await this.generateTemporaryToken(id, email);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('EMAIL_APP_SPECIFIC_PASS'),
      },
    });
    const mailOptions = {
      from: this.configService.get<string>('EMAIL'),
      to: email,
      subject: `Welcome ${name} to ${this.configService.get<string>('APP_NAME')}`,
      html: this.activationEmailTemplate
        .replace(/{{APP_NAME}}/g, `${this.configService.get<string>('APP_NAME')}`)
        .replace(/{{website}}/g, `${this.configService.get<string>('WEBSITE')}`)
        .replace(/{{token}}/g, activationToken)
        .replace(/{{name}}/g, name),
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new InternalServerErrorException('Failed to send activation email.');
      } else {
        return { messageId: info.messageId };
      }
    });
  }
  async sendResetPasswordEmail(email: string): Promise<{ messageId: string } | void> {
    const user = await this.userService.getUserByEmail(email, '+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { id, name } = user;
    const resetPasswordtoken = await this.generateTemporaryToken(id, email);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('EMAIL_APP_SPECIFIC_PASS'),
      },
    });
    const mailOptions = {
      from: this.configService.get<string>('EMAIL'),
      to: email,
      subject: `Welcome ${name} to ${this.configService.get<string>('APP_NAME')}`,
      html: this.resetPasswordEmailTemplate
        .replace(/{{APP_NAME}}/g, `${this.configService.get<string>('APP_NAME')}`)
        .replace(/{{website}}/g, `${this.configService.get<string>('WEBSITE')}`)
        .replace(/{{token}}/g, resetPasswordtoken)
        .replace(/{{name}}/g, name),
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new InternalServerErrorException('Failed to send reset-password email.');
      } else {
        return { messageId: info.messageId };
      }
    });
  }

  async sendOTPCodeToEmail(email: string, OTP: string): Promise<{ messageId: string } | void> {
    const user = await this.userService.getUserByEmail(email, '+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { name } = user;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('EMAIL_APP_SPECIFIC_PASS'),
      },
    });
    const mailOptions = {
      from: this.configService.get<string>('EMAIL'),
      to: email,
      subject: `Welcome ${name} to ${this.configService.get<string>('APP_NAME')}`,
      html: this.OTPEmailTemplate.replace(/{{APP_NAME}}/g, `${this.configService.get<string>('APP_NAME')}`)
        .replace(/{{name}}/g, name)
        .replace(/{{code}}/g, OTP),
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new InternalServerErrorException('Failed to send OTP code to email.');
      } else {
        return { messageId: info.messageId };
      }
    });
  }
  private async generateTemporaryToken(id: string, email: string): Promise<string> {
    const secret = this.configService.get<string>('TEMP_JWT_SECRET');
    const expiresIn = this.configService.get<number>('TEMP_JWT_TTL_MS');

    // Used for activation and reset_password
    const temporaryToken = await this.jwtService.signAsync({ id, email }, { secret, expiresIn });
    return temporaryToken;
  }
}
