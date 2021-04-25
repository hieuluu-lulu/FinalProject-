const express = require('express');
const route = express.Router();
const quizController = require('../app/controllers/QuizController');
const lessonController = require('../app/controllers/LessonController');
const { ensureAuth, admin } = require('../config/auth');
const { validate } = require('../app/middlewares/validate');

//  quiz
route.put('/quiz/:id', ensureAuth, admin, quizController.editQuizHandler);
route.get('/quiz/:id/edit', ensureAuth, admin, quizController.editQuiz);
route.delete('/quiz/:id', ensureAuth, admin, quizController.forceDelete);
route.post(
    '/quiz/handle-actions',
    ensureAuth,
    admin,
    quizController.handleFormActions,
);
route.post('/do-excercise', quizController.quizHandler);
route.post('/create/quiz', ensureAuth, admin, quizController.saveQuiz);
route.get('/create/quiz', ensureAuth, admin, quizController.createQuiz);
//
route.post('/handle-actions', lessonController.handleFormActions);
route.post(
    '/save',
    ensureAuth,
    admin,
    validate.validateCreateLesson(),
    lessonController.storedLesson,
);
route.put('/comment/edit', lessonController.editCommentHandler);
route.put('/comment/:id', lessonController.deleteCommentHandler);
route.post('/comment', lessonController.commentHandler);
route.post('/comment/reply', lessonController.replyHandler);
route.get('/create', ensureAuth, admin, lessonController.createLesson);
route.get('/:id/edit', ensureAuth, admin, lessonController.editLesson);
route.put('/:id', lessonController.updateLesson);
route.patch('/:id/restore', ensureAuth, admin, lessonController.restore);
route.delete('/:id', lessonController.delete);
route.delete('/:id/force', lessonController.forceDelete);
route.get('/:tag/:slug', ensureAuth, lessonController.showLessionDetails);
route.get('/:slug', ensureAuth, lessonController.checkLesson);
route.get('/', ensureAuth, lessonController.index);

module.exports = route;
