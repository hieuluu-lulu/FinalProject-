const express = require('express');
const route = express.Router();

const lessonController = require('../app/controllers/LessonController');
const { ensureAuth, admin } = require('../config/auth');

route.post('/handle-form-actions', lessonController.handleFormActions);
route.post('/save', lessonController.storedLesson);
route.get('/create', admin, lessonController.createLesson);
route.get('/:id/edit', lessonController.editLesson);
route.put('/:id', lessonController.updateLesson);
route.get('/:id/restore', lessonController.restore);
route.delete('/:id', lessonController.delete);
route.delete('/:id/force', lessonController.forceDelete);
route.get('/:tag/:slug', lessonController.showLessionDetails);
route.get('/:slug', lessonController.checkLesson);
route.get('/', lessonController.index);
module.exports = route;
