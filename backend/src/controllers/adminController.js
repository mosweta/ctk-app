/**
 * Admin controllers.
 *
 * All functions here assume req.user has already been populated by the
 * authMiddleware. They check that the user has the right role and then
 * perform the operation.
 */

import { supabaseAdmin } from '../lib/supabaseClient.js';
import { AppError } from '../middleware/errorMiddleware.js';

// ---------------------------------------------------------------------
// Audit Logging Helper
// ---------------------------------------------------------------------
const logAudit = async (userId, action, entity, entityId) => {
  try {
    await supabaseAdmin.from('audit_logs').insert({
      user_id: userId,
      action,
      entity,
      entity_id: String(entityId),
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
    // Do not throw; audit failure should not break the main operation
  }
};

// ---------------------------------------------------------------------
// Dashboard Stats
// ---------------------------------------------------------------------
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date().toISOString();

    const [
      { count: upcomingEvents },
      { count: publishedAnnouncements },
      { count: pendingRegistrations },
      { data: recentActivity },
    ] = await Promise.all([
      supabaseAdmin
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('start_time', now),
      supabaseAdmin
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),
      supabaseAdmin
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabaseAdmin
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          upcomingEvents: upcomingEvents || 0,
          publishedAnnouncements: publishedAnnouncements || 0,
          pendingRegistrations: pendingRegistrations || 0,
        },
        recentActivity: recentActivity || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------
// Events CRUD
// ---------------------------------------------------------------------
export const getAllEvents = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = supabaseAdmin
      .from('events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: { page: Number(page), limit: Number(limit), total: count },
    });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      created_by: req.user.id,
      updated_by: req.user.id,
    };

    if (eventData.status === 'published') {
      eventData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;

    await logAudit(req.user.id, 'create', 'event', data.id);

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_by: req.user.id,
      updated_at: new Date().toISOString(),
    };

    // If publishing for the first time, set published_at
    if (updateData.status === 'published') {
      const { data: existing } = await supabaseAdmin
        .from('events')
        .select('published_at')
        .eq('id', id)
        .single();

      if (!existing?.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new AppError('Event not found', 404);

    await logAudit(req.user.id, 'update', 'event', id);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin.from('events').delete().eq('id', id);
    if (error) throw error;

    await logAudit(req.user.id, 'delete', 'event', id);

    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------
// Announcements CRUD
// ---------------------------------------------------------------------
export const getAllAnnouncements = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = supabaseAdmin
      .from('announcements')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: { page: Number(page), limit: Number(limit), total: count },
    });
  } catch (err) {
    next(err);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user.id,
      updated_by: req.user.id,
    };

    if (payload.status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    await logAudit(req.user.id, 'create', 'announcement', data.id);

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_by: req.user.id,
      updated_at: new Date().toISOString(),
    };

    if (updateData.status === 'published') {
      const { data: existing } = await supabaseAdmin
        .from('announcements')
        .select('published_at')
        .eq('id', id)
        .single();

      if (!existing?.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabaseAdmin
      .from('announcements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new AppError('Announcement not found', 404);

    await logAudit(req.user.id, 'update', 'announcement', id);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await logAudit(req.user.id, 'delete', 'announcement', id);

    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------
// Gallery CRUD
// ---------------------------------------------------------------------
export const getAllGalleryImages = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Attach public URLs
    const images = data.map((img) => ({
      ...img,
      url: supabaseAdmin.storage.from('media').getPublicUrl(img.storage_path).data.publicUrl,
    }));

    res.json({ success: true, data: images });
  } catch (err) {
    next(err);
  }
};

export const createGalleryImage = async (req, res, next) => {
  try {
    const { caption, storage_path } = req.body;

    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .insert({
        caption,
        storage_path,
        status: 'published', // default to published on upload
        created_by: req.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    await logAudit(req.user.id, 'create', 'gallery_image', data.id);

    // Return with URL
    const imageWithUrl = {
      ...data,
      url: supabaseAdmin.storage.from('media').getPublicUrl(data.storage_path).data.publicUrl,
    };

    res.status(201).json({ success: true, data: imageWithUrl });
  } catch (err) {
    next(err);
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the image record to know which file to delete
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('gallery_images')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError || !image) throw new AppError('Image not found', 404);


    // Delete the file from storage
    await supabaseAdmin.storage.from('media').remove([image.storage_path]);

    // Delete the database record
    const { error } = await supabaseAdmin
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await logAudit(req.user.id, 'delete', 'gallery_image', id);

    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------
// Parish Bulletins (Structured Announcements)
// ---------------------------------------------------------------------
export const getBulletins = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('parish_bulletins')
      .select('*')
      .order('sunday_date', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getBulletinById = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('parish_bulletins')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error || !data) throw new AppError('Bulletin not found', 404);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const createBulletin = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user.id,
    };
    if (payload.status === 'published') {
      payload.published_at = new Date().toISOString();
    }
    const { data, error } = await supabaseAdmin
      .from('parish_bulletins')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    await logAudit(req.user.id, 'create', 'bulletin', data.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const updateBulletin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    
    if (payload.status === 'published' && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }
    
    const { data, error } = await supabaseAdmin
      .from('parish_bulletins')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) throw new AppError('Bulletin not found', 404);
    await logAudit(req.user.id, 'update', 'bulletin', id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const deleteBulletin = async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin
      .from('parish_bulletins')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    await logAudit(req.user.id, 'delete', 'bulletin', req.params.id);
    res.json({ success: true, message: 'Bulletin deleted' });
  } catch (err) { next(err); }
};

// ---------------------------------------------------------------------
// Groups (Jumuiyas, Choirs, Ecclesial Groups)
// ---------------------------------------------------------------------
export const getAllGroupsAdmin = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('groups')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    // Auto-generate a slug from the name if not provided
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const payload = {
      ...req.body,
      slug,
    };

    const { data, error } = await supabaseAdmin
      .from('groups')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    await logAudit(req.user.id, 'create', 'group', data.id);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    // If the name changed, regenerate the slug unless a custom one was provided
    if (payload.name && !payload.slug) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const { data, error } = await supabaseAdmin
      .from('groups')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new AppError('Group not found', 404);
    await logAudit(req.user.id, 'update', 'group', id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('groups').delete().eq('id', id);
    if (error) throw error;
    await logAudit(req.user.id, 'delete', 'group', id);
    res.json({ success: true, message: 'Group deleted' });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------
// Parish Settings
// ---------------------------------------------------------------------
export const updateParishSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      throw new AppError('Settings object required', 400);
    }

    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_by: req.user.id,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from('parish_settings')
      .upsert(updates, { onConflict: 'key' })
      .select();

    if (error) throw error;

    await logAudit(req.user.id, 'update', 'parish_settings', 'all');

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------
// Daily Readings Admin
// ---------------------------------------------------------------------
export const listCachedReadings = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('daily_readings_cache')
      .select('reading_date, fetched_at, is_manual_override')
      .order('reading_date', { ascending: false })
      .limit(60);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const refreshReadingsDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new AppError('Invalid date format. Use YYYY-MM-DD.', 400);
    }

    // Import the service dynamically
    const { refreshReadings } = await import('../services/readingsService.js');
    const result = await refreshReadings(date);

    await logAudit(req.user.id, 'refresh', 'readings', date);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------
export const getAllStaff = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('staff_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const createStaff = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('staff_members')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    await logAudit(req.user.id, 'create', 'staff', data.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('staff_members')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new AppError('Staff member not found', 404);
    await logAudit(req.user.id, 'update', 'staff', id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const deleteStaff = async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin
      .from('staff_members')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    await logAudit(req.user.id, 'delete', 'staff', req.params.id);
    res.json({ success: true, message: 'Staff member removed' });
  } catch (err) { next(err); }
};

// ---------------------------------------------------------------------
// Livestreams
// ---------------------------------------------------------------------

/**
 * Extracts the 11-character YouTube video ID from any common URL format.
 * Returns null if the URL is not a recognizable YouTube link.
 */
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getAllLivestreams = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('livestreams')
      .select('*')
      .order('display_order', { ascending: true })
      .order('stream_date', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createLivestream = async (req, res, next) => {
  try {
    const videoId = extractYouTubeId(req.body.youtube_url);
    if (!videoId) {
      throw new AppError('Invalid YouTube URL', 400);
    }

    const payload = {
      ...req.body,
      youtube_video_id: videoId,
      thumbnail_url:
        req.body.thumbnail_url ||
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      created_by: req.user.id,
      updated_by: req.user.id,
    };

    if (payload.status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('livestreams')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    await logAudit(req.user.id, 'create', 'livestream', data.id);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateLivestream = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      updated_by: req.user.id,
      updated_at: new Date().toISOString(),
    };

    // If the URL changed, re-extract the ID and thumbnail
    if (req.body.youtube_url) {
      const videoId = extractYouTubeId(req.body.youtube_url);
      if (!videoId) {
        throw new AppError('Invalid YouTube URL', 400);
      }
      payload.youtube_video_id = videoId;
      if (!req.body.thumbnail_url) {
        payload.thumbnail_url = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // Set published_at on first publish
    if (payload.status === 'published') {
      const { data: existing } = await supabaseAdmin
        .from('livestreams')
        .select('published_at')
        .eq('id', id)
        .single();

      if (!existing?.published_at) {
        payload.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabaseAdmin
      .from('livestreams')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new AppError('Livestream not found', 404);

    await logAudit(req.user.id, 'update', 'livestream', id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteLivestream = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('livestreams')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await logAudit(req.user.id, 'delete', 'livestream', id);
    res.json({ success: true, message: 'Livestream deleted' });
  } catch (err) {
    next(err);
  }
};