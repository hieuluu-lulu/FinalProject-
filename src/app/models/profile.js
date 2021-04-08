const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
    {
        fullname: { type: String },
        email: { type: String },
        phonenumber: { type: Number },
        birthday: Date,
        country: { type: String },
        city: { type: String },
        address: { type: String },
        facebook: { type: String },
        userID: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    },
);

const Profile = mongoose.model('Profile ', ProfileSchema);

module.exports = Profile;
