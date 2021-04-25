const Course = require('../models/courseModel');
const Lesson = require('../models/lessonModel');
const User = require('../models/usersModel');
const Quiz = require('../models/quizModel');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
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
            Quiz.findOne({ lesson: req.params.slug }),
        ])
            .then(([course, lessons, lesson, count, quiz]) => {
                if (course) {
                    User.findOne({ _id: req.user }).then((user) => {
                        if (!user.learning.includes(req.params.tag)) {
                            User.updateOne(
                                { _id: req.user },
                                { $push: { learning: req.params.tag } },
                            ).then();
                            User.updateOne(
                                { _id: req.user },
                                { coin: user.coin - course.price },
                            ).then();
                            Course.updateOne(
                                { tag: req.params.tag },
                                { members: course.members + 1 },
                            ).then();
                        }
                    });
                }
                if (lesson) {
                    req.flash('success', 'Register course successfully');
                    res.locals.title = lesson.name;
                    res.render('lessons/lesson', {
                        quiz: quiz,
                        course: course,
                        lessons: lessons,
                        lesson: lesson,
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
        const lesson = new Lesson({
            name: req.body.name,
            image: `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`,
            videoId: req.body.videoId,
            tag: req.body.tag,
        });
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
                Promise.all([
                    Lesson.deleteMany({
                        lessonID: { $in: req.body.LessonIds },
                    }),
                    Quiz.deleteMany({ quizID: { $in: req.body.QuizIds } }),
                ])
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
    commentHandler(req, res, next) {
        var comment_id = mongoose.Types.ObjectId();
        var createAt = new Date();
        Lesson.updateOne(
            { _id: req.body.lesson_id },
            {
                $push: {
                    comments: {
                        _id: comment_id,
                        username: req.user.name,
                        comment: req.body.comment,
                        image: req.user.image,
                        userId: req.user._id,
                        createAt,
                        commentId: uuidv4(),
                    },
                },
            },
        )
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }
    replyHandler(req, res, next) {
        var reply_id = mongoose.Types.ObjectId();
        var createAt = new Date();

        Lesson.findOne({ _id: req.body.lesson_id }).then((lesson) => {
            let objIndex = lesson.comments.findIndex(
                (x) => x._id.toString() === req.body.comment_id,
            );
            let reply = {
                _id: reply_id,
                username: req.user.name,
                reply: req.body.reply,
                image: req.user.image,
                createAt,
            };
            let arr = [];

            if (Array.isArray(lesson?.comments[objIndex]?.replies)) {
                arr = lesson.comments[objIndex].replies;
            }
            lesson.comments[objIndex].replies = [...arr, reply];

            const newLesson = new Lesson(lesson);
            var upsertData = newLesson.toObject();
            Lesson.updateOne({ _id: req.body.lesson_id }, upsertData, {
                upsert: true,
            })

                .then(() => {
                    res.redirect('back');
                })
                .catch(next);
        });
    }
    editCommentHandler(req, res, next) {
        Lesson.findOne({ _id: req.body.lesson_id }).then((lesson) => {
            var newComment = req.body.newcomment;
            let objIndex = lesson.comments.findIndex(
                (x) => x._id.toString() == req.body.comment_id,
            );

            lesson.comments[objIndex].comment = newComment;

            // course.save({upsert:true})
            const newLesson = new Lesson(lesson);
            var upsertData = newLesson.toObject();
            Lesson.updateOne({ _id: req.body.lesson_id }, upsertData, {
                upsert: true,
            })
                .then(() => {
                    res.redirect('back');
                })
                .catch(next);
        });
    }
    deleteCommentHandler(req, res, next) {
        Lesson.findOne({ _id: req.body.lesson_id }).then((lesson) => {
            var index = lesson.comments
                ? lesson.comments.indexOf(req.params.id)
                : -1; // check index of comments array
            lesson.comments.splice(index, 1);
            // lesson.save({upsert:true})
            const newLesson = new Lesson(lesson);
            var upsertData = newLesson.toObject();
            Lesson.updateOne({ _id: req.body.lesson_id }, upsertData, {
                upsert: true,
            })
                .then(() => {
                    res.redirect('back');
                })
                .catch(next);
        });
    }
}
module.exports = new LessonController();
