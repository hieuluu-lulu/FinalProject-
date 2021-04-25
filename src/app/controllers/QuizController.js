const Lesson = require('../models/lessonModel');
const User = require('../models/usersModel');
const Quiz = require('../models/quizModel');

class QuizController {
    quizHandler(req, res, next) {
        User.findOne({ _id: req.user }).then((user) => {
            if (req.body.quiz === req.body.result) {
                user.coin = user.coin + 50;
                user.save().then(() => {
                    res.locals.title = 'Congratulation!!!';
                    res.render('lessons/success');
                });
            } else {
                res.locals.title = ' Fail!!!';
                res.render('lessons/error');
            }
        });
    }
    createQuiz(req, res, next) {
        Lesson.find({})
            .then((lesson) => {
                res.locals.title = 'Create Quiz';
                res.render('lessons/createQuiz', {
                    user: req.user,
                    lesson: lesson,
                });
            })
            .catch(next);
    }
    saveQuiz(req, res, next) {
        const quiz = new Quiz({
            question: req.body.question,
            answer1: req.body.ans1,
            answer2: req.body.ans2,
            answer3: req.body.ans3,
            answer4: req.body.ans4,
            result: req.body.result,
            lesson: req.body.lesson,
        });
        quiz.save()
            .then(() => res.redirect('/manage/stored/quiz'))
            .catch(next);
    }
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'force-delete':
                Quiz.deleteMany({ quizID: { $in: req.body.QuizIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action Invalid!' });
        }
    }
    forceDelete(req, res, next) {
        Quiz.deleteOne({ quizID: req.params.id })
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }
    editQuiz(req, res, next) {
        Promise.all([Lesson.find({}), Quiz.findById({ _id: req.params.id })])
            .then(([lesson, quiz]) => {
                res.locals.title = 'Edit Question';
                res.render('lessons/editQuiz', {
                    lesson: lesson,
                    quiz: quiz,
                    user: req.user,
                });
            })
            .catch(next);
    }
    editQuizHandler(req, res, next) {
        Quiz.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/manage/stored/quiz'))
            .catch(next);
    }
}
module.exports = new QuizController();
