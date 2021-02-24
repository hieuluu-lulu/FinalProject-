const express = require('express');
const router = express.Router();

const manageController = require('../app/controllers/ManageController');

router.get('/stored/courses', manageController.storedCourses);

module.exports = router;
