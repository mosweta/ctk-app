/**
 * Request body validation via Joi schemas.
 *
 * Usage:
 *   router.post('/events', validate(eventSchema), controller.create);
 *
 * On success, req.body is replaced with the validated and sanitized
 * value (unknown keys stripped). On failure, a 400 is returned with a
 * readable message.
 */

import { AppError } from './errorMiddleware.js';

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return next(new AppError(message, 400));
  }

  req.body = value;
  next();
};