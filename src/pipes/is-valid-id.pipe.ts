import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class IsValidID implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const isValidId = mongoose.Types.ObjectId.isValid(value);

    if (!isValidId) {
      throw new BadRequestException('ID invalido');
    }

    return value;
  }
}
