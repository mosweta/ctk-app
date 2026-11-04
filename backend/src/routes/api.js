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
import { cache } from '../middleware/cacheMiddleware.js'; // <-- ADDED THIS IMPORT

const router = express.Router();

// ---- Reads (Cached for 6 hours) -------------------------------------
// 21600 seconds = 6 hours
router.get('/events', cache(21600), publicController.getEvents);
router.get('/announcements', cache(21600), publicController.getAnnouncements);
router.get('/ministries', cache(21600), publicController.getMinistries);
router.get('/groups', cache(21600), publicController.getGroups);
router.get('/parish-settings', cache(21600), publicController.getParishSettings);
router.get('/gallery', cache(21600), publicController.getGallery);

// Readings are cached for 12 hours (43200 seconds) since they change at midnight
router.get('/readings/today', cache(43200), publicController.getReadings);
router.get('/readings/:date', cache(43200), publicController.getReadings);


// ---- Writes (public forms) -----------------------------------------
router.post('/contact', formLimiter, validate(contactSchema), formController.submitContact);
router.post('/register', formLimiter, validate(registrationSchema), formController.submitRegistration);

// ---- Inline Reads (Cached) -----------------------------------------
router.get('/bulletins', cache(21600), async (req, res, next) => {
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

// Leave specific slugs uncached
router.get('/groups/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('groups').select('*').eq('slug', req.params.slug).single();
    if (error || !data) throw new Error('Not found');
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/staff', cache(21600), async (req, res, next) => {
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

// Leave specific event IDs uncached
router.get('/events/:id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .eq('status', 'published')
      .single();

    if (error || !data) throw new Error('Event not found');

    res.json({ success: true, data });
  } catch {
    res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }
});

// Livestreams (public)
router.get('/livestreams', cache(21600), async (req, res) => {
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
    console.error('Failed to fetch livestreams:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch livestreams',
    });
  }
});

export default router;