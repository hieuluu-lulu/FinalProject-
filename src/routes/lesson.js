const express = require('express');
const route = express.Router();

const lessonController = require('../app/controllers/LessonController');
const { ensureAuth, admin } = require('../config/auth');
const router = require('./course');

router.put('/progress', lessonController.updateProgress);
route.post('/handle-actions', lessonController.handleFormActions);
route.post('/save', ensureAuth, admin, lessonController.storedLesson);
route.get('/create', ensureAuth, admin, lessonController.createLesson);
route.get('/:id/edit', ensureAuth, admin, lessonController.editLesson);
route.put('/:id', lessonController.updateLesson);
route.get('/:id/restore', ensureAuth, admin, lessonController.restore);
route.delete('/:id', lessonController.delete);
route.delete('/:id/force', lessonController.forceDelete);
route.get('/:tag/:slug', ensureAuth, lessonController.showLessionDetails);
route.get('/:slug', ensureAuth, lessonController.checkLesson);
route.get('/', ensureAuth, lessonController.index);
module.exports = route;
