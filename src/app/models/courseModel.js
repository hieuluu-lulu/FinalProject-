const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CourseSchema = new Schema(
    {
        courseID: { type: Number },
        name: { type: String, maxLength: 255, require: true },
        author: { type: String, maxLength: 255, require: true },
        description: { type: String, maxLength: 600, require: true },
        image: { type: String, maxLength: 255 },
        videoId: { type: String, required: true },
        category: { type: String, required: true },
        level: { type: String, maxLength: 255, required: true },
        price: { type: Number },
        tag: { type: String, required: true },
        slug: { type: String, slug: 'name', unique: true },
        topic: { type: Array },
        request: { type: Array },
        comments: [{}],
    },
    {
        timestamps: true,
    },
);

mongoose.plugin(slug);
CourseSchema.plugin(AutoIncrement, { inc_field: 'courseID' });
CourseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Course', CourseSchema);
