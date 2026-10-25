/**
 * Joi validation schemas for incoming request bodies.
 *
 * Each schema describes exactly what is allowed. Anything not listed
 * is stripped by the validate middleware before it reaches the
 * controller.
 */

import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().trim().min(10).max(5000).required(),
});

export const registrationSchema = Joi.object({
  type: Joi.string().valid('parish', 'ministry').required(),
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().max(30).allow('', null),
  data: Joi.object().default({}),
});

export const eventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().trim().max(5000).allow('', null),
  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().allow(null),
  location: Joi.string().trim().max(200).allow('', null),
  category: Joi.string().trim().max(100).allow('', null),
  image_url: Joi.string().uri().allow('', null),
  status: Joi.string().valid('draft', 'published', 'archived', 'cancelled'),
});