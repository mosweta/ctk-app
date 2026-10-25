/**
 * Public API routes. No authentication required.
 *
 * All routes here are for the public website. Rate limiting is applied
 * to form submission endpoints.
 */
import { supabaseAdmin } from '../lib/supabaseClient.js';
import express from 'express';
import * as publicController from '../controllers/publicController.js';
import * as formController from '../controllers/formController.js';
import { formLimiter } from '../middleware/rateLimitMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { contactSchema, registrationSchema } from '../validators/schemas.js';

const router = express.Router();

// ---- Reads ----------------------------------------------------------
router.get('/events', publicController.getEvents);
router.get('/announcements', publicController.getAnnouncements);
router.get('/ministries', publicController.getMinistries);
router.get('/groups', publicController.getGroups);
router.get('/parish-settings', publicController.getParishSettings);
router.get('/gallery', publicController.getGallery);
router.get('/readings/today', publicController.getReadings);
router.get('/readings/:date', publicController.getReadings);


// ---- Writes (public forms) -----------------------------------------
router.post('/contact', formLimiter, validate(contactSchema), formController.submitContact);
router.post('/register', formLimiter, validate(registrationSchema), formController.submitRegistration);

router.get('/bulletins', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('parish_bulletins')
      .select('*')
      .eq('status', 'published')
      .order('sunday_date', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/groups/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('groups').select('*').eq('slug', req.params.slug).single();
    if (error || !data) throw new Error('Not found');
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/staff', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('staff_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/events/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .eq('status', 'published')
      .single();

    if (error || !data) throw new Error('Event not found');
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: 'Event not found' });
  }
});

// Livestreams (public)
router.get('/livestreams', async (req, res, _next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('livestreams')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('stream_date', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;