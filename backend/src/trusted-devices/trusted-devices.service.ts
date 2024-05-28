import { TrustedDevice, TrustedDeviceDocument } from './schemas/trustedDevice.schema';
import { FingerprintObj } from '@/auth/types/fingerprint.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TrustedDevicesService {
  constructor(@InjectModel(TrustedDevice.name) private trustedDeviceModel: Model<TrustedDeviceDocument>) {}

  async getTrustedDevicesByUserId(userId: string): Promise<TrustedDevice[]> {
    const trustedDevices = await this.trustedDeviceModel
      .find({ user: userId }, { _id: 0, id: '$_id', label: '$fingerprint.label' })
      .lean()
      .exec();
    return trustedDevices;
  }
  async isDeviceTrusted(userId: string, fingerprint: FingerprintObj): Promise<boolean> {
    const trustedDevice = await this.trustedDeviceModel.find({ user: userId, fingerprint }).lean().exec();
    return trustedDevice.length > 0 ? true : false;
  }
  async deleteTokenByValue(fingerprint: FingerprintObj): Promise<void> {
    await this.trustedDeviceModel.findOneAndDelete({ fingerprint: fingerprint }).exec();
  }

  async updateTrustedDeviceByFingerprint({
    user,
    fingerprint,
  }: {
    user: string;
    fingerprint: FingerprintObj;
  }): Promise<TrustedDevice | null> {
    const trustedDevice = await this.trustedDeviceModel
      .findOneAndUpdate({ user, fingerprint }, { fingerprint }, { new: true, upsert: true })
      .exec();
    if (!trustedDevice) {
      throw new NotFoundException('Error adding to trusted devices');
    }
    return trustedDevice;
  }

  async deleteManyByUserId(userId: string): Promise<boolean> {
    const result: { acknowledged: boolean; deletedCount: number } = await this.trustedDeviceModel
      .deleteMany({ user: userId })
      .exec();
    return result.acknowledged;
  }
  async deleteByFingerprint({ userId, fingerprint }: { userId: string; fingerprint: FingerprintObj }): Promise<any> {
    const result = await this.trustedDeviceModel.findOneAndDelete({ user: userId, fingerprint }).exec();
    return result;
  }
}
