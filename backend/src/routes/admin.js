/**
 * Admin API routes.
 *
 * Everything in this file requires authentication. Most endpoints
 * require the editor or admin role; a few require admin only.
 */

import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, adminOnly, editorOrAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { eventSchema } from '../validators/schemas.js';

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

// Settings
router.put('/settings', adminOnly, adminController.updateParishSettings);


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