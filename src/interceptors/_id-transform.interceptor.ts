import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as mongoose from 'mongoose';

@Injectable()
export class _idTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const newData = {
          id: new mongoose.Types.ObjectId(data._id),
          ...data.toJSON(),
        };

        return newData;
      }),
    );
  }
}
