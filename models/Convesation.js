const {Schema, model, Types} = require('mongoose');

const schema = Schema({
    chatName: String,
    conversation: [
        {
            message: String,
            timestamp: String,
            user: {
                displayName: String,
                email: String,
                // photo: String,
                uid: String
            }
        }
    ]
});

module.exports = model('conversations', schema);