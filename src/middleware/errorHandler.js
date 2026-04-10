import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
  }
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
}
