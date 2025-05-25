import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor) {}

  intercept(
    _context_: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: never) =>
        plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        }),
      ),
    );
  }
}
