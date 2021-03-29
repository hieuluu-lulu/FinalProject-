const express = require('express');
const router = express.Router();

const manageController = require('../app/controllers/ManageController');
const { ensureAuth, admin } = require('../config/auth');
router.get(
    '/stored/courses',
    ensureAuth,
    admin,
    manageController.storedCourses,
);
router.get('/stored/lessons', ensureAuth, admin, manageController.storedLesson);
router.get('/trash/courses', ensureAuth, admin, manageController.trashCourses);
router.get('/trash/lessons', ensureAuth, admin, manageController.trashLesson);
router.get(
    '/stored/category',
    ensureAuth,
    admin,
    manageController.storedCategory,
);

module.exports = router;
