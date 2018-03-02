import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    color: String,
    mute: Boolean,
    ban: Boolean
});

let User = mongoose.model('User', userSchema);

module.exports = User;