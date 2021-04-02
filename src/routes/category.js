const express = require('express');
const router = express.Router();
const categoryController = require('../app/controllers/CategoryController');
const { validate } = require('../app/middlewares/validate');
const { ensureAuth, admin } = require('../config/auth');

router.post(
    '/create',
    validate.validateCategory(),
    categoryController.storeCategory,
);
router.put('/:id', categoryController.update);
router.get('/:id/edit', admin, categoryController.edit);
router.post('/handle-actions', admin, categoryController.handleFormActions);
router.get('/create', ensureAuth, admin, categoryController.createCategory);
router.get('/:slug', categoryController.categoryCourse);
router.patch('/:id/restore', categoryController.restore);
router.delete('/:id', categoryController.delete);
router.delete('/:id/force', categoryController.forceDelete);
module.exports = router;
