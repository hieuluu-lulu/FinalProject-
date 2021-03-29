const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController');
const { ensureAuth, admin } = require('../config/auth');
router.post('/handle-actions', admin, courseController.handleFormActions);
router.get('/create', ensureAuth, admin, courseController.createCourses);
router.post('/save', courseController.storedCourses);
router.get('/:slug', ensureAuth, courseController.showCourse);
router.get('/:id/edit', courseController.edit);
router.put('/:id', courseController.update);
router.patch('/:id/restore', courseController.restore);
router.delete('/:id', courseController.delete);
router.delete('/:id/force', courseController.forceDelete);
router.get('/', courseController.index);

module.exports = router;
