const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const QuizSchema = new Schema(
    {
        question: String,
        answer1: String,
        answer2: String,
        answer3: String,
        answer4: String,
        result: String,
        lesson: String,
    },
    {
        timestamps: true,
    },
);

const Quiz = mongoose.model('Quiz ', QuizSchema);

module.exports = Quiz;
