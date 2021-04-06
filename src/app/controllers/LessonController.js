const Course = require('../models/courseModel');
const Lesson = require('../models/lessonModel');
const User = require('../models/usersModel');
const { validationResult } = require('express-validator');
class LessonController {
    index(req, res, next) {
        res.status(404).send('Xin lỗi trang không tồn tại');
    }
    //[GET] /learning/:slug
    checkLesson(req, res, next) {
        Lesson.findOne({ tag: req.params.slug }).then((lesson) => {
            lesson
                ? res.redirect('/lessons/' + lesson.tag + '/' + lesson.slug)
                : res.status(404).json('Chưa có bài học nào trong khóa này');
        });
    }
    //GET learning/:tag/:slug
    showLessionDetails(req, res, next) {
        Promise.all([
            Course.findOne({ tag: req.params.tag }),
            Lesson.find({ tag: req.params.tag }),
            Lesson.findOne({ tag: req.params.tag, slug: req.params.slug }),
            Lesson.countDocuments({ tag: req.params.tag }),
        ])
            .then(([course, lessons, lesson, count]) => {
                if (course) {
                    User.findOne({ _id: req.user }).then((user) => {
                        if (user.learning.includes(req.params.tag) == false) {
                            User.updateOne(
                                { _id: req.user },
                                { $push: { learning: req.params.tag } },
                            ).then();
                            Course.updateOne(
                                { tag: req.params.tag },
                                { __v: course.__v + 1 },
                            ).then();
                        }
                    });
                }
                if (lesson) {
                    req.flash('success', 'Register course successfully');
                    res.locals.title = lesson.name;
                    res.render('lessons/lesson', {
                        course: course,
                        lessons: lessons,
                        user: req.user,
                        videoID: lesson.videoId,
                        tag: lesson.tag,
                        name: lesson.name,
                        slug: lesson.slug,
                        count: count,
                    });
                }
            })
            .catch(next);
    }
    // [GET] /learning/create
    createLesson(req, res, next) {
        Course.find({}).then((tag) => {
            res.locals.title = 'Create Lesson';
            res.render('lessons/createLesson', {
                user: req.user,
                tag: tag,
                data: {},
                errors: {},
            });
        });
    }
    // [POST] /learning/store
    storedLesson(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return [
                Course.find({}).then((tag) => {
                    res.locals.title = 'Error';
                    res.render('lessons/createLesson', {
                        user: req.user,
                        tag: tag,
                        data: req.body,
                        errors: errors.mapped(),
                    });
                }),
            ];
        }
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        const lesson = new Lesson(req.body);
        lesson
            .save()
            .then(() => res.redirect('/manage/stored/lessons'))
            .catch(next);
    }
    // [GET] /learning/:id/edit
    editLesson(req, res, next) {
        Promise.all([Course.find({}), Lesson.findById({ _id: req.params.id })])
            .then(([tag, lesson]) => {
                res.locals.title = 'Edit Lesson';
                res.render('lessons/edit', {
                    tag: tag,
                    lesson: lesson,
                    user: req.user,
                    errors: {},
                    data: {},
                });
            })
            .catch(next);
    }
    // [PUT] /learning/:id
    updateLesson(req, res, next) {
        Lesson.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/manage/stored/lessons'))
            .catch(next);
    }
    updateProgress(req, res, next) {}
    // sử dụng thư viện moogose-delete để xóa và đưa vào thúng rác
    //[DELETE]/courses/:id/
    delete(req, res, next) {
        Lesson.delete({ lessonID: req.params.id })
            .then(() => res.redirect('/manage/stored/lessons'))
            .catch(next);
    }
    //khôi phục dữ liệu
    // [PATCH]/lesson/:id/restore
    restore(req, res, next) {
        Lesson.restore({ lessonID: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[DELETE]/courses/:id/force  // xóa vĩnh viễn khóa học
    forceDelete(req, res, next) {
        Lesson.deleteOne({ lessonID: req.params.id })
            .then(() => res.redirect('/manage/stored/lessons'))
            .catch(next);
    }
    // [POST]/courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'force-delete':
                Lesson.deleteMany({ lessonID: { $in: req.body.LessonIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'delete':
                Lesson.delete({ lessonID: { $in: req.body.LessonIds } }) //
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Lesson.restore({ lessonID: { $in: req.body.LessonIds } }) //
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action Invalid!' });
        }
    }
}
module.exports = new LessonController();
