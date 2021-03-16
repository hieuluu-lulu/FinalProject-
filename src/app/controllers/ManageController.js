const Course = require('../models/courseModel');
const Lesson = require('../models/lessonModel');
const User = require('../models/usersModel');
class ManageController {
    //[GET]/manage/stored/courses
    storedCourses(req, res, next) {
        Promise.all([Course.find({}), Course.countDocumentsDeleted()]) // bất đồng bộ trong js
            .then(([courses, deletedCount]) => {
                res.locals.title = 'Manange Courses';
                res.render('manage/stored-courses', {
                    deletedCount,
                    courses: courses,
                });
            })
            .catch(next);
    }
    trashCourses(req, res, next) {
        Promise.all([Course.findDeleted({}), Course.countDocuments()])
            .then(([courses, countDocuments]) => {
                if (account) {
                    res.locals.title = 'Manange Courses';
                    res.render('manage/trash-courses', {
                        courses: courses,
                        countDocuments,
                    });
                }
            })
            .catch(next);
    }
    storedLesson(req, res, next) {
        Promise.all([Lesson.find({}), Lesson.countDocumentsDeleted()]) // bất đồng bộ trong js
            .then(([lesson, deletedCount]) => {
                res.locals.title = 'Manage Lessons';
                res.render('manage/stored-courses', {
                    deletedCount,
                    lesson: lesson,
                });
            })
            .catch(next);
    }
    trashLesson(req, res, next) {
        Promise.all([Lesson.findDeleted({}), Lesson.countDocuments()])
            .then(([lesson, countLesson]) => {
                if (account) {
                    res.render('manage/trash-courses', {
                        lesson: lesson,
                        countLesson,
                    });
                }
            })
            .catch(next);
    }
    storedUser(req, res, next) {
        Promise.all([
            User.find({}).sortable(req),
            User.findOne({ _id: req.user._id }),
        ])
            .then(([account, user]) => {
                res.render('manage/stored-users'),
                    {
                        account: account,
                        username: user.name,
                    };
            })
            .catch(next);
    }
}
module.exports = new ManageController();
