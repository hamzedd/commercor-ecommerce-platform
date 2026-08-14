import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const inbound = req.header('x-request-id') || '';
  const id = /^[A-Za-z0-9._:-]{1,128}$/.test(inbound) ? inbound : randomUUID();
  (req as Request & { requestId: string }).requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}
