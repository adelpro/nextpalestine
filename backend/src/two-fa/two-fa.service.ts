import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TrustedDevicesService } from '@/trusted-devices/trusted-devices.service';
import { FingerprintObj } from '@/auth/types/fingerprint.type';
import { UsersService } from '@/users/users.service';
import { AuthService } from '@/auth/auth.service';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { MailerService } from '@/mailer/mailer.service';
@Injectable()
export class TwoFAService {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private trustedDeviceService: TrustedDevicesService,
    private mailerService: MailerService,
  ) {}
  sendOTPCodeToEmail = async (userId: string) => {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const email = user.email;
    const secret = user.twoFASecrect;
    if (!secret) {
      throw new NotFoundException('User 2FA secret not found');
    }
    const OTP = authenticator.generate(secret);
    await this.mailerService.sendOTPCodeToEmail(email, OTP);

    return 'OTP code sent to email';
  };
  async generateQRCode(id: string): Promise<string | null> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user?.twoFASecrect) {
      const secret = await generateTwoFASecret();
      user.twoFASecrect = secret;
      user.save();
    }
    const qrcode = await generateTwoFAQRCode(user.email, user.twoFASecrect);
    return qrcode;
  }
  async enableTwoFA({
    currentUserId,
    TOTP,
    fingerprint,
  }: {
    currentUserId: string;
    TOTP: string;
    fingerprint: FingerprintObj;
  }): Promise<{ message: string; cookieToken: string }> {
    const user = await this.userService.getUserById(currentUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user?.twoFASecrect) {
      throw new NotFoundException('User 2FA secret not found');
    }
    const secret = user.twoFASecrect;
    authenticator.options = {
      window: 15,
    };
    const isValid = authenticator.verify({ token: TOTP, secret });
    if (!isValid) {
      throw new UnauthorizedException('Invalid TOTP, 2FA not enabled');
    }

    user.isTwoFAEnabled = true;
    await user.save();

    await this.trustedDeviceService.updateTrustedDeviceByFingerprint({ user: currentUserId, fingerprint });

    const cookieToken = await this.authService.generateAndSaveToken(user, fingerprint);
    return { message: '2FA enabled successfully, and your device was added to trusted devices', cookieToken };
  }
  async verifyTwoFA(id: string, TOTP: string, fingerprint: FingerprintObj): Promise<{ message: string }> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user?.isTwoFAEnabled || !user?.twoFASecrect) {
      throw new NotFoundException('2FA not enabled for this user');
    }

    authenticator.options = {
      window: 15,
    };
    const isValid = authenticator.verify({ token: TOTP, secret: user.twoFASecrect });
    if (!isValid) {
      throw new UnauthorizedException('Invalid TOTP, verification failed');
    }

    await this.trustedDeviceService.updateTrustedDeviceByFingerprint({ user: id, fingerprint });

    return { message: 'Device successfully added to trusted devices' };
  }
  async disable2FA(id: string, fingerprint: FingerprintObj): Promise<{ message: string; cookieToken: string }> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!this.trustedDeviceService.isDeviceTrusted(id, fingerprint)) {
      throw new UnauthorizedException('Only trusted devices can disable 2FA');
    }
    user.twoFASecrect = null;
    user.isTwoFAEnabled = false;

    const deleteTrustedDevices = await this.trustedDeviceService.deleteManyByUserId(user.id);
    if (!deleteTrustedDevices) {
      throw new NotFoundException('Error deleting trusted devices');
    }
    user.save();
    const cookieToken = await this.authService.generateAndSaveToken(user, fingerprint);
    return { message: '2FA disabled successfully', cookieToken };
  }
}
async function generateTwoFAQRCode(email: string, secret: string): Promise<string | null> {
  const otpauthURL = authenticator.keyuri(email, 'nextpalestine', secret);
  try {
    return qrcode.toDataURL(otpauthURL);
  } catch {
    return null;
  }
}
async function generateTwoFASecret() {
  const secret = authenticator.generateSecret();
  return secret;
}
