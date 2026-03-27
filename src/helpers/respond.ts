import { Response } from 'express';

export function notFound(res: Response, entity = 'Resource') {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `${entity} not found.` } });
}

export function badRequest(res: Response, message: string) {
  res.status(400).json({ error: { code: 'VALIDATION_ERROR', message } });
}
