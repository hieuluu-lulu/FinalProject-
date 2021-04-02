const Category = require('../models/categoryModel');
const Course = require('../models/courseModel');
const { check, validationResult } = require('express-validator');

class CategoryController {
    createCategory(req, res, next) {
        res.locals.title = 'Create Category';
        res.render('category/addCategory', {
            user: req.user,
            data: {},
            errors: {},
        });
    }
    storeCategory(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return [
                (res.locals.title = 'Create Category'),
                res.render('category/addCategory', {
                    data: req.body,
                    errors: errors.mapped(),
                }),
            ];
        }
        const category = new Category(req.body);
        category
            .save()
            .then(() => res.redirect('/manage/stored/category'))
            .catch(next);
    }
    categoryCourse(req, res, next) {
        let searchOptions = {};
        if (req.query.name !== null && req.query.name !== '') {
            searchOptions.name = new RegExp(req.query.name, 'i');
        }
        Promise.all([
            Course.find({ category: req.params.slug }),
            Category.find({}),
            Course.find(searchOptions),
        ])
            .then(([course, category]) => {
                res.locals.title = 'IFE Education - Nothing impossible';
                res.render('courses/courses_category', {
                    user: req.user,
                    course,
                    category: category,
                    searchOptions: req.query,
                });
            })
            .catch(next);
    }
    edit(req, res, next) {
        Category.findById({ _id: req.params.id }).then((category) => {
            res.locals.title = 'Update Category';
            res.render('category/editCategory', {
                category: category,
                user: req.user,
                data: {},
                errors: {},
            });
        });
    }
    update(req, res, next) {
        Category.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('/manage/stored/category');
            })
            .catch(next);
    }
    delete(req, res, next) {
        Category.delete({ _id: req.params.id })
            .then(() => {
                res.redirect('/manage/stored/category');
            })
            .catch(next);
    }
    forceDelete(req, res, next) {
        Category.deleteOne({ _id: req.params.id })
            .then(() => {
                res.redirect('/manage/stored/category');
            })
            .catch(next);
    }
    restore(req, res, next) {
        Category.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'force-delete':
                Category.deleteMany({ _id: { $in: req.body.CategoryIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'delete':
                Category.delete({ _id: { $in: req.body.CategoryIds } }) // xóa tất cả thằng nào có id nằm trong CourseIds
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Category.restore({ _id: { $in: req.body.CategoryIds } }) // khôi phục tất cả thằng nào có id nằm trong CourseIds
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action Invalid!' });
        }
    }
}
module.exports = new CategoryController();
