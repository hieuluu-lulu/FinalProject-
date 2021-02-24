const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController');
const { ensureAuth, admin } = require('../config/auth');
router.get('/create', admin, courseController.createCourses);
router.post('/save', courseController.storedCourses);
router.get('/:slug', courseController.showCourse);
router.get('/', ensureAuth, courseController.index);

module.exports = router;
