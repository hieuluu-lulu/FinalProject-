const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Lesson = new Schema(
    {
        lessonID: { type: Number },
        name: { type: String, required: true },
        image: { type: String },
        videoId: { type: String, required: true },
        tag: { type: String },
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    },
);

// Add plugins
mongoose.plugin(slug);
Lesson.plugin(AutoIncrement, { inc_field: 'lessonID' });
Lesson.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Lesson', Lesson);
