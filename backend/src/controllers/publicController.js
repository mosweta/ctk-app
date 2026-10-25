/**
 * Public endpoints. No authentication required.
 *
 * These serve data to the public-facing website. Only published content
 * is returned, filtered by the query itself (not by RLS, since this
 * uses the service_role key which bypasses RLS).
 */

import { supabaseAdmin } from '../lib/supabaseClient.js';
import { getDailyReadings } from '../services/readingsService.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const getEvents = async (req, res, next) => {
  try {
    const { upcoming } = req.query;
    let query = supabaseAdmin
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('start_time', { ascending: true });

    if (upcoming === 'true') {
      query = query.gte('start_time', new Date().toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getMinistries = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('ministries')
      .select('*')
      .eq('is_public', true)
      .order('name');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getGroups = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('groups')
      .select('*')
      .eq('is_public', true)
      .order('category')
      .order('display_order');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getParishSettings = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('parish_settings')
      .select('key, value');

    if (error) throw error;

    const settings = data.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

export const getGallery = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const images = data.map((img) => ({
      ...img,
      url: supabaseAdmin.storage.from('media').getPublicUrl(img.storage_path).data.publicUrl,
    }));

    res.json({ success: true, data: images });
  } catch (err) { next(err); }
};

export const getReadings = async (req, res, next) => {
  try {
    let date = new Date();
    if (req.params.date) {
      date = new Date(req.params.date);
      if (isNaN(date.getTime())) {
        throw new AppError('Invalid date format. Use YYYY-MM-DD.', 400);
      }
    }

    const readings = await getDailyReadings(date);
    res.json({ success: true, data: readings });
  } catch (err) { next(err); }
};