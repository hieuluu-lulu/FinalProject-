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
}
module.exports = new CategoryController();
