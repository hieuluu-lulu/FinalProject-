const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
const CategorySchema = new Schema(
    {
        title: { type: String, maxLength: 255, required: true },
        type: { type: String, maxLength: 255, required: true },
        slug: { type: String, slug: 'title', unique: true },
    },
    {
        timestamps: true,
    },
);

mongoose.plugin(slug);
CategorySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
module.exports = mongoose.model('Category', CategorySchema);
