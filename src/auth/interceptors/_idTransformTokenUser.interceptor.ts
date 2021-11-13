import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as mongoose from 'mongoose';

@Injectable()
export class _idTransformTokenUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const newData = {
          token: data.token,
          user: {
            id: new mongoose.Types.ObjectId(data.user._id),
            ...data.user.toJSON(),
          },
        };

        return newData;
      }),
    );
  }
}
