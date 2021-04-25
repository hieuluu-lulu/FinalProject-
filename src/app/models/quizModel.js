const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const QuizSchema = new Schema(
    {
        quizID: Number,
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
QuizSchema.plugin(AutoIncrement, { inc_field: 'quizID' });

const Quiz = mongoose.model('Quiz ', QuizSchema);

module.exports = Quiz;
