const express = require('express');
const router = express.Router();
const { validate } = require('../app/middlewares/validate');

const courseController = require('../app/controllers/CourseController');
const { ensureAuth, admin } = require('../config/auth');
router.post('/handle-actions', admin, courseController.handleFormActions);

router.post(
    '/save',
    validate.validateCreateCourses(),
    courseController.storedCourses,
);
router.put('/comment/edit', courseController.editCommentHandler);
router.put('/comment/:id', courseController.deleteCommentHandler);
router.post('/comment', courseController.commentHandler);
router.post('/comment/reply', courseController.replyHandler);
router.get('/create', ensureAuth, admin, courseController.createCourses);
router.get('/:id/edit', admin, courseController.edit);
router.put('/:id', courseController.update);
router.patch('/:id/restore', courseController.restore);
router.delete('/:id', courseController.delete);
router.delete('/:id/force', courseController.forceDelete);
router.get('/:slug', courseController.showCourse);
router.get('/', courseController.index);

module.exports = router;
