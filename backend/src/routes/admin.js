/**
 * Admin API routes.
 *
 * Everything in this file requires authentication. Most endpoints
 * require the editor or admin role; a few require admin only.
 */

import express from 'express';
import multer from 'multer';
import * as adminController from '../controllers/adminController.js';
import { protect, editorOrAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { eventSchema } from '../validators/schemas.js';

// Configure multer to hold files in memory before sending to Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});
const router = express.Router();

// Every route in this file requires authentication
router.use(protect);

// Dashboard
router.get('/dashboard', editorOrAdmin, adminController.getDashboardStats);

// Events
router.get('/events', editorOrAdmin, adminController.getAllEvents);
router.post('/events', editorOrAdmin, validate(eventSchema), adminController.createEvent);
router.put('/events/:id', editorOrAdmin, validate(eventSchema), adminController.updateEvent);
router.delete('/events/:id', editorOrAdmin, adminController.deleteEvent);

// Announcements
router.get('/announcements', editorOrAdmin, adminController.getAllAnnouncements);
router.post('/announcements', editorOrAdmin, adminController.createAnnouncement);
router.put('/announcements/:id', editorOrAdmin, adminController.updateAnnouncement);
router.delete('/announcements/:id', editorOrAdmin, adminController.deleteAnnouncement);

// Gallery
router.get('/gallery', editorOrAdmin, adminController.getAllGalleryImages);
router.post('/gallery', editorOrAdmin, adminController.createGalleryImage);
router.delete('/gallery/:id', editorOrAdmin, adminController.deleteGalleryImage);

// Bulletins
router.get('/bulletins', editorOrAdmin, adminController.getBulletins);
router.get('/bulletins/:id', editorOrAdmin, adminController.getBulletinById);
router.post('/bulletins', editorOrAdmin, adminController.createBulletin);
router.put('/bulletins/:id', editorOrAdmin, adminController.updateBulletin);
router.delete('/bulletins/:id', editorOrAdmin, adminController.deleteBulletin);

// Groups
router.get('/groups', editorOrAdmin, adminController.getAllGroupsAdmin);
router.post('/groups', editorOrAdmin, adminController.createGroup);
router.put('/groups/:id', editorOrAdmin, adminController.updateGroup);
router.delete('/groups/:id', editorOrAdmin, adminController.deleteGroup);

// POST /api/admin/upload
router.post('/upload', editorOrAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Get the folder from the request body (e.g., 'events', 'gallery', 'staff', 'groups')
    const folder = req.body.folder || 'misc';
    
    // Generate a safe, unique filename
    const ext = req.file.mimetype.split('/')[1];
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `${folder}/${uniqueName}`;

    // Upload to Supabase using the admin client (bypasses RLS)
    const { supabaseAdmin } = await import('../lib/supabaseClient.js');
    const { error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(filePath);

    res.json({
      success: true,
      data: { path: filePath, url: publicUrl }
    });
  } catch (err) {
    next(err);
  }
});

// Staff
router.get('/staff', editorOrAdmin, adminController.getAllStaff);
router.post('/staff', editorOrAdmin, adminController.createStaff);
router.put('/staff/:id', editorOrAdmin, adminController.updateStaff);
router.delete('/staff/:id', editorOrAdmin, adminController.deleteStaff);

// Livestreams
router.get('/livestreams', editorOrAdmin, adminController.getAllLivestreams);
router.post('/livestreams', editorOrAdmin, adminController.createLivestream);
router.put('/livestreams/:id', editorOrAdmin, adminController.updateLivestream);
router.delete('/livestreams/:id', editorOrAdmin, adminController.deleteLivestream);

export default router;