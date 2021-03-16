const Course = require('../models/courseModel');
const Lesson = require('../models/lessonModel');
const User = require('../models/usersModel');

class CourseController {
    index(req, res, next) {
        Course.find({})
            .then((course) => {
                res.locals.title = 'Courses';
                res.render('courses/courses', {
                    course: course,
                    user: req.user,
                });
            })
            .catch(next);
    }
    showCourse(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                Promise.all([
                    Lesson.countDocuments({ tag: course.tag }),
                    Lesson.find({ tag: course.tag }),
                ]).then(([count, lesson]) => {
                    res.locals.title = course.name;
                    res.render('courses/showCourse', {
                        lesson: lesson,
                        course: course,
                        num_lesson: count,
                    });
                });
            })
            .catch(next);
    }
    createCourses(req, res, next) {
        res.locals.title = 'Create Courses';
        res.render('courses/create', {
            user: req.user,
        });
    }
    // post dữ liệu mới tạo vào db
    // [POST]/courses/store
    storedCourses(req, res, next) {
        const formData = req.body;
        formData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        const course = new Course(formData);
        course
            .save()
            .then(() => res.redirect('/manage/stored/courses'))
            .catch(next);
    }
    // [GET] /courses/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then((course) =>
                res.render('courses/edit', {
                    course: course,
                    user: req.user,
                }),
            )
            .catch(next);
    }
    // [PUT]/courses/:id/
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('manage/stored/courses');
            })
            .catch(next);
    }
    //khôi phục dữ liệu
    // [PATCH]/courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // sử dụng thư viện moogose-delete để xóa và đưa vào thúng rác
    //[DELETE]/courses/:id/
    delete(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('/manage/stored/courses'))
            .catch(next);
    }
    //[DELETE]/courses/:id/force  // xóa vĩnh viễn khóa học
    forceDelete(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/manage/stored/courses'))
            .catch(next);
    }
    // [POST]/courses/handle-fsorm-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.CourseIds } }) // xóa tất cả thằng nào có id nằm trong CourseIds
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Course.restore({ _id: { $in: req.body.CourseIds } }) // khôi phục tất cả thằng nào có id nằm trong CourseIds
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action Invalid!' });
        }
    }
}
module.exports = new CourseController();
