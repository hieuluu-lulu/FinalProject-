const Course = require('../models/courseModel');
const Lesson = require('../models/lessonModel');
const User = require('../models/usersModel');
const Category = require('../models/categoryModel');
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
        Course.findDeleted({})
            .then((courses) => {
                res.locals.title = 'Trash Courses';
                res.render('manage/trash-courses', {
                    courses: courses,
                });
            })
            .catch(next);
    }
    storedLesson(req, res, next) {
        Promise.all([Lesson.find({}), Lesson.countDocumentsDeleted()]) // bất đồng bộ trong js
            .then(([lesson, deletedCount]) => {
                res.locals.title = 'Manage Lessons';
                res.render('manage/stored-lesson', {
                    deletedCount,
                    lesson: lesson,
                });
            })
            .catch(next);
    }
    trashLesson(req, res, next) {
        Lesson.findDeleted({})
            .then((lessons) => {
                res.locals.title = 'Trash Lesson';
                res.render('manage/trash-lessons', {
                    lessons: lessons,
                });
            })
            .catch(next);
    }
    storedUser(req, res, next) {
        User.find({})
            .then((account) => {
                res.locals.title = 'Manange Users';

                res.render('manage/stored-user', {
                    account: account,
                    user: req.user,
                });
            })
            .catch(next);
    }
    forceDelete(req, res, next) {
        User.deleteOne({ userID: req.params.id })
            .then(() => res.redirect('/manage/stored/users'))
            .catch(next);
    }
    storedCategory(req, res, next) {
        Promise.all([Category.find({}), Category.countDocumentsDeleted()]) // bất đồng bộ trong js
            .then(([category, deletedCount]) => {
                res.locals.title = 'Manange Category';
                res.render('manage/stored-category', {
                    deletedCount,
                    category: category,
                });
            })
            .catch(next);
    }
    trashCategory(req, res, next) {
        Category.findDeleted({}).then((category) => {
            res.locals.title = 'Trash Category';
            res.render('manage/trash-category', {
                category: category,
            });
        });
    }
}
module.exports = new ManageController();
