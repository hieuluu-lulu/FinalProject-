const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose)
const UserSchema = new Schema(
    {
        userID : { type: Number},
        name: { type: String, require: true },
        email: { type: String, required: true },
        password: { type: String, require: true },
        date: { type: Date, default: Date.now },
        facebookId: { type: String},
        googleId: { type: String}
    },
    {
        timestamps: true,
    },
);
UserSchema.plugin(AutoIncrement, {inc_field: 'userID'})
const User =  mongoose.model('User', UserSchema);

module.exports = User;