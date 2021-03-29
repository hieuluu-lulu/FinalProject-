const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema(
    {
        ID: { type: Number },
        name: { type: String },
        email: { type: String },
        password: { type: String, require: true },
        date: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    },
);
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
