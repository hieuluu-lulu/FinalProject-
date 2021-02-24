const Course = require('../models/courseModel');
const Lesson = require('../models/lessonModel');
const User = require('../models/userModel');

class LessonController {
    index(req, res, next) {
        res.status(404).send('Xin lỗi trang không tồn tại');
    }
    //[GET] /learning/:slug
    checkLesson(req, res, next) {
        Lesson.findOne({ tag: req.params.tag }).then((lesson) => {
            lesson
                ? res.redirect('/lesson/' + lesson.tag + '/' + lesson.slug)
                : res.status(404).json('Chưa có bài học nào trong khóa này');
        });
    }
    //GET learning/:tag/:slug
    showLessionDetails(req, res, next) {
        Promise.all([
            Lesson.find({ tag: req.params.tag }),
            Lesson.findOne({ tag: req.params.tag, slug: req.params.slug }),
        ])
            .then(([lessons, details]) => {
                res.render('lessons/lesson'),
                    {
                        lesson: lessons,
                        videoID: details.videoId,
                        tag: details.tag,
                        name: details.name,
                        slug: details.slug,
                    };
            })
            .catch(next);
    }
    // [GET] /learning/create
    createLesson(req, res, next) {
        Course.find({}).then((tag) => {
            res.render('lessons/createLesson'),
                {
                    tag: tag,
                };
        });
    }
    // [POST] /learning/store
    storedLesson(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        const lesson = new Lesson(req.body);
        lesson
            .save()
            .then(() => res.redirect('/manage/stored/lessons'))
            .catch(next);
    }
    // [GET] /learning/:id/edit
    editLesson(req, res, next) {
        Promise.all([Course.find({}), Lesson.findById(req.params.id)])
            .then(([tag, lesson]) => {
                res.render('lessons/edit'),
                    {
                        tag: tag,
                        lesson: lesson,
                    };
            })
            .catch(next);
    }
    // [PUT] /learning/:id
    updateLesson(req, res, next) {
        Lesson.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('manage/stored/lessons'))
            .catch(next);
    }
    // sử dụng thư viện moogose-delete để xóa và đưa vào thúng rác
    //[DELETE]/courses/:id/
    delete(req, res, next) {
        Lesson.delete({ _id: req.params.id })
            .then(() => res.redirect('/manage/stored/lessons'))
            .catch(next);
    }
    //khôi phục dữ li
    // [PATCH]/lesson/:id/restore
    restore(req, res, next) {
        Lesson.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[DELETE]/courses/:id/force  // xóa vĩnh viễn khóa học
    forceDelete(req, res, next) {
        Lesson.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/manage/stored/lessons'))
            .catch(next);
    }
    // [POST]/courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Lesson.delete({ _id: { $in: req.body.LessonIds } }) //
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Lesson.restore({ _id: { $in: req.body.LessonIds } }) //
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action Invalid!' });
        }
    }
}
module.exports = new LessonController();
