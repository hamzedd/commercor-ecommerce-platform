import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class SafeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SafeExceptionFilter.name);
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host
      .switchToHttp()
      .getRequest<Request & { requestId?: string }>();
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (!(error instanceof HttpException) || status >= 500)
      this.logger.error(
        `Unhandled request error requestId=${request.requestId || 'unknown'}`,
        error instanceof Error ? error.stack : String(error),
      );
    const body = error instanceof HttpException ? error.getResponse() : null;
    if (status < 500 && typeof body === 'object')
      return response.status(status).json(body);
    if (status < 500)
      return response
        .status(status)
        .json({ statusCode: status, message: body });
    return response
      .status(status)
      .json({ statusCode: status, message: 'Internal server error' });
  }
}
