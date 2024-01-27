import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { readableStreamLikeToAsyncGenerator } from 'rxjs/internal/util/isReadableStreamLike';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';

export interface Response<T> {
  statusCode: number;
  outcome: string;
  result: boolean;
  message: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private logger: Logger = new Logger('RESPONSE ERROR INTERCEPTOR');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // console.log(data);
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          outcome: 'Success',
          result: true,
          message: data.message,
          data: data.data,
        };
      }),
      catchError((err) => {
        // console.log(err);
        this.logger.log(err);
        const result = false;
        let statusCode = err.status;
        const outcome = 'Error';
        let message = err.response?.reason;
        let field = err.response?.field;
        if (err instanceof QueryFailedError) {
          statusCode = HttpStatus.BAD_REQUEST;
          if (Number(err.driverError.code) === 23505) {
            message = 'Duplicate value.';
            field = err.driverError.detail.substring(
              err.driverError.detail.indexOf('(') + 1,
              err.driverError.detail.indexOf(')'),
            );
          } else if (Number(err.driverError.code) === 23502) {
            message = 'Cannot be empty.';
            field = err.driverError.column;
          } else message = err.driverError.error || err.message;
        }
        if (err instanceof ValidationError) {
          message =
            typeof err.constraints === 'object'
              ? Object.values(err.constraints)[0]
              : err.constraints;
          field = err.property;
        }
        if (err instanceof ValidationError) {
          message =
            typeof err.constraints === 'object'
              ? Object.values(err.constraints)[0]
              : err.constraints;
          field = err.property;
          statusCode = HttpStatus.FORBIDDEN;
        }
        if (err instanceof EntityNotFoundError) {
          message = 'Data not found.';
          field =
            err.message.split('"')[1].split('Entity')[0].toLowerCase() + 'Id';
        } else {
          statusCode = err.status || HttpStatus.FORBIDDEN;
          message =
            err.response?.reason || err.response?.message[0] || err?.message;
        }
        readableStreamLikeToAsyncGenerator(err.response);
        return rethrow(
          new HttpException(
            { outcome, statusCode, result, message, field },
            statusCode,
          ),
        );
      }),
    );
  }
}
