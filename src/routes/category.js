const express = require('express');
const route = express.Router();
const categoryController = require('../app/controllers/CategoryController');
const { validate } = require('../app/middlewares/validate');

route.post(
    '/create',
    validate.validateCategory(),
    categoryController.storeCategory,
);
route.get('/create', categoryController.createCategory);
route.get('/:slug', categoryController.categoryCourse);

module.exports = route;
