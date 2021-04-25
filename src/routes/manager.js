const express = require('express');
const router = express.Router();

const manageController = require('../app/controllers/ManageController');
const { ensureAuth, admin } = require('../config/auth');
//course
router.get(
    '/stored/courses',
    ensureAuth,
    admin,
    manageController.storedCourses,
);
router.get('/trash/courses', ensureAuth, admin, manageController.trashCourses);
//lesson
router.get('/stored/lessons', ensureAuth, admin, manageController.storedLesson);
router.get('/trash/lessons', ensureAuth, admin, manageController.trashLesson);
router.get(
    '/stored/category',
    ensureAuth,
    admin,
    manageController.storedCategory,
);
// category
router.get(
    '/trash/category',
    ensureAuth,
    admin,
    manageController.trashCategory,
);
//user
router.get('/stored/users', ensureAuth, admin, manageController.storedUser);
router.delete('/:id', manageController.forceDelete);
// router.post('/handle-actions',manageController.handleFormActions)
//quiz

router.get('/stored/quiz', ensureAuth, admin, manageController.storedQuiz);
module.exports = router;
