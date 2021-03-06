const { check, body } = require('express-validator');

const User = require('../models/usersModel');
const Course = require('../models/courseModel');
const Category = require('../models/categoryModel');
const bcrypt = require('bcryptjs');

let validateCategory = () => {
    return [
        check('title', 'Title does not Empty')
            .not()
            .isEmpty()
            .isLength({ min: 1 }),
        check('type', 'Please select Type!')
            .optional()
            .isIn(['front-end', 'back-end', 'android', 'ios']),
    ];
};
let validateCreateCourses = () => {
    return [
        check('name', 'Name of Course is required').not().isEmpty(),
        check('author', 'Author of Course is required').not().isEmpty(),
        check('description', 'Description for Course is required')
            .not()
            .isEmpty(),
        check('videoId', 'Video Id for Course is required').not().isEmpty(),
        // check('image', 'Image for course is required').not().isEmpty(),
        check('level', 'Level of Course is required').not().isEmpty(),
        check('tag', 'Tag of Course is required').not().isEmpty(),
        check('price', 'Price of Course is required').not().isEmpty(),
        check('topic', 'Topic of Course is required').not().isEmpty(),
        check('request', 'Request of Course is required').not().isEmpty(),
        check('category').custom((value) => {
            return Category.find({}).then((category) => {
                const title = category.map((category) => {
                    return category.slug;
                });
                console.log(title.includes(value));
                if (title.includes(value)) {
                    return true;
                } else if (!title.includes(value)) {
                    throw new Error('Please select a Category');
                }
            });
        }),
    ];
};
let validateCreateLesson = () => {
    return [
        check('name', 'Name of Lesson is required').not().isEmpty(),
        check('videoId', 'Video Id of Lesson is required').not().isEmpty(),
        check('tag').custom((value) => {
            return Course.find({}).then((course) => {
                const tag = course.map((course) => {
                    return course.tag;
                });
                // console.log(tag.includes(value))
                if (tag.includes(value)) {
                    return true;
                } else if (!tag.includes(value)) {
                    throw new Error('Please select a Tag for Lesson');
                }
            });
        }),
    ];
};
let validateChangePassword = () => {
    return [
        check('newpassword', 'Password is required')
            .not()
            .isEmpty()
            .isLength({ min: 6 })
            .withMessage('Password must contain at least 6 characters'),
        check('oldpassword', 'Password is required').not().isEmpty(),
        check('oldpassword').custom(async (value, { req }) => {
            const match = await bcrypt.compare(value, req.user.password);
            if (match) {
                return true;
            } else {
                throw new Error('Your Password is incorrect!');
            }
        }),
        check('passwordconfirm', 'Password is required').not().isEmpty(),
        check('passwordconfirm').custom((value, { req }) => {
            if (value !== req.body.newpassword) {
                throw new Error(
                    'Password confirmation does not match password',
                );
            } else {
                return true;
            }
        }),
    ];
};
let validateUpdateProfile = () => {
    return [
        body('fullname', 'This field is required').not().isEmpty(),
        body('img').custom((value, { req }) => {
            if (!req.file) throw new Error('Please select an image');
            return true;
        }),
        body('date', 'This field is required').not().isEmpty(),
        body('phonenumber', 'This field is required').not().isEmpty(),
        body('country', 'This field is required').not().isEmpty(),
        body('city', 'This field is required').not().isEmpty(),
    ];
};

let validate = {
    validateCategory: validateCategory,
    validateCreateCourses: validateCreateCourses,
    validateCreateLesson: validateCreateLesson,
    validateChangePassword: validateChangePassword,
    validateUpdateProfile: validateUpdateProfile,
};

module.exports = { validate };
