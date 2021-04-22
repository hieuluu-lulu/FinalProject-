const Course = require('../models/courseModel');
const Lesson = require('../models/lessonModel');
const User = require('../models/usersModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const { doc } = require('prettier');
class CourseController {
    index(req, res, next) {
        let searchOptions = {};
        if (req.query.name !== null && req.query.name !== '') {
            searchOptions.name = new RegExp(req.query.name, 'i');
        }
        Promise.all([Course.find(searchOptions), Category.find({})])
            .then(([course, category]) => {
                res.locals.title = 'All Courses';
                res.render('courses/courses', {
                    course,
                    user: req.user,
                    searchOptions: req.query,
                    category: category,
                });
            })
            .catch(next);
    }
    showCourse(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                Promise.all([
                    Category.findOne({ slug: course.category }),
                    Lesson.countDocuments({ tag: course.tag }),
                    Lesson.find({ tag: course.tag }),
                ]).then(([cate, count, lesson]) => {
                    res.locals.title = course.name;
                    res.render('courses/showCourse', {
                        user: req.user,
                        category: cate,
                        lesson: lesson,
                        course: course,
                        num_lesson: count,
                    });
                });
            })
            .catch(next);
    }
    createCourses(req, res, next) {
        Category.find({}).then((categories) => {
            res.locals.title = 'Create Courses';
            res.render('courses/create', {
                user: req.user,
                categories: categories,
                data: {},
                errors: {},
            });
        });
    }
    // post dữ liệu mới tạo vào db
    // [POST]/courses/store
    storedCourses(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return [
                Category.find({}).then((categories) => {
                    res.locals.title = 'Error';
                    res.render('courses/create', {
                        user: req.user,
                        categories: categories,
                        data: req.body,
                        errors: errors.mapped(),
                    });
                }),
            ];
        }

        const course = new Course({
            name: req.body.name,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            topic: req.body.topic.split('.'),
            request: req.body.request.split('.'),
            videoId: req.body.videoId,
            level: req.body.level,
            tag: req.body.tag,
            category: req.body.category,
            image: `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`,
        });

        course
            .save()
            .then(() => res.redirect('/manage/stored/courses'))
            .catch(next);
    }
    // [GET] /courses/:id/edit
    edit(req, res, next) {
        Promise.all([
            Course.findById({ _id: req.params.id }),
            Category.find({}),
        ])
            .then(([course, category]) => {
                var topic = course.topic.toString();
                var request = course.request.toString();
                res.locals.title = 'Update Courses';
                res.render('courses/edit', {
                    course: course,
                    user: req.user,
                    topic,
                    request,
                    data: {},
                    errors: {},
                    categories: category,
                });
            })
            .catch(next);
    }
    // [PUT]/courses/:id/
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/manage/stored/courses');
            })
            .catch(next);
    }
    //khôi phục dữ liệu
    // [PATCH]/courses/:id/restore
    restore(req, res, next) {
        Course.restore({ courseID: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // sử dụng thư viện moogose-delete để xóa và đưa vào thúng rác
    //[DELETE]/courses/:id/
    delete(req, res, next) {
        Course.delete({ courseID: req.params.id })
            .then(() => res.redirect('/manage/stored/courses'))
            .catch(next);
    }
    //[DELETE]/courses/:id/force  // xóa vĩnh viễn khóa học
    forceDelete(req, res, next) {
        Course.deleteOne({ courseID: req.params.id })
            .then(() => res.redirect('/manage/stored/courses'))
            .catch(next);
    }
    // [POST]/courses/handle-fsorm-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'force-delete':
                Course.deleteMany({ courseID: { $in: req.body.CourseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'delete':
                Course.delete({ courseID: { $in: req.body.CourseIds } }) // xóa tất cả thằng nào có id nằm trong CourseIds
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Course.restore({ courseID: { $in: req.body.CourseIds } }) // khôi phục tất cả thằng nào có id nằm trong CourseIds
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
        Course.updateOne(
            { _id: req.body.course_id },
            {
                $push: {
                    comments: {
                        _id: comment_id,
                        username: req.body.username,
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

        Course.findOne({ _id: req.body.course_id }).then((course) => {
            let objIndex = course.comments.findIndex(
                (x) => x._id.toString() == req.body.comment_id,
            );
            let reply = {
                _id: reply_id,
                username: req.user.name,
                reply: req.body.reply,
                image: req.user.image,
                createAt,
            };
            let arr = [];

            if (Array.isArray(course?.comments[objIndex]?.replies)) {
                arr = course.comments[objIndex].replies;
            }
            course.comments[objIndex].replies = [...arr, reply];

            const newCourse = new Course(course);
            var upsertData = newCourse.toObject();
            Course.updateOne({ _id: req.body.course_id }, upsertData, {
                upsert: true,
            })

                .then(() => {
                    res.redirect('back');
                })
                .catch(next);
        });
    }
    editCommentHandler(req, res, next) {
        Course.findOne({ _id: req.body.course_id }).then((course) => {
            var newComment = req.body.newcomment;
            let objIndex = course.comments.findIndex(
                (x) => x._id.toString() == req.body.comment_id,
            );

            course.comments[objIndex].comment = newComment;

            // course.save({upsert:true})
            const newCourse = new Course(course);
            var upsertData = newCourse.toObject();
            Course.updateOne({ _id: req.body.course_id }, upsertData, {
                upsert: true,
            })
                .then(() => {
                    res.redirect('back');
                })
                .catch(next);
        });
    }
    deleteCommentHandler(req, res, next) {
        Course.findOne({ _id: req.body.course_id }).then((course) => {
            var index = course.comments
                ? course.comments.indexOf(req.params.id)
                : -1; // check index of comments array
            course.comments.splice(index, 1);
            // course.save({upsert:true})
            const newCourse = new Course(course);
            var upsertData = newCourse.toObject();
            Course.updateOne({ _id: req.body.course_id }, upsertData, {
                upsert: true,
            })
                .then(() => {
                    res.redirect('back');
                })
                .catch(next);
        });
    }
}
module.exports = new CourseController();
