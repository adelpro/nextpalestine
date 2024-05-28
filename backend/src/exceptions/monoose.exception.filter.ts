import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Response } from 'express';

@Catch(mongoose.Error)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(exception.errors).map((err: { message: string }) => err.message);
      response.status(400).json({ message: 'Validation failed', errors });
    } else {
      response.status(500).json({ message: 'Internal server error' });
    }
  }
}
