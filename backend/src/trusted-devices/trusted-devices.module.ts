import { Module } from '@nestjs/common';

import { TrustedDevice, TrustedDeviceSchema } from './schemas/trustedDevice.schema';
import { TrustedDevicesService } from './trusted-devices.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: TrustedDevice.name, schema: TrustedDeviceSchema }])],
  providers: [TrustedDevicesService],
  exports: [TrustedDevicesService],
})
export class TrustedDevicesModule {}
