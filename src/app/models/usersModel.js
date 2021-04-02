const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const UserSchema = new Schema(
    {
        userID: { type: Number },
        name: { type: String },
        email: { type: String },
        password: { type: String, require: true },
        date: { type: Date, default: Date.now },
        facebookId: { type: String },
        googleId: { type: String },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        progress: { type: Number, default: 0 },
        learning: { type: Array },
    },
    {
        timestamps: true,
    },
);
UserSchema.plugin(AutoIncrement, { inc_field: 'userID' });
const User = mongoose.model('User', UserSchema);

module.exports = User;
