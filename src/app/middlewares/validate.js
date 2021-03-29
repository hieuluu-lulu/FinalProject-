const { check } = require('express-validator');

let validateCategory = () => {
    return [
        check('title', 'Title does not Empty')
            .not()
            .isEmpty()
            .isLength({ min: 1 }),
        check('type', 'Please select Type!').not().isEmpty(),
    ];
};
let validate = {
    validateCategory: validateCategory,
};

module.exports = { validate };
