import mongoose from 'mongoose';

const messagesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: String,
    userID: String,
    created: {
        type: Date,
        default: Date.now
    }
});

let Message = mongoose.model('Message', messagesSchema);

module.exports = Message;