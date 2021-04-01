const {Schema, model, Types} = require('mongoose');

const schema = Schema({
    chatName: String,
    chatImg: String,
    participants: [{
        type: String
    }],
    conversation: [{
        message: String,
        timestamp: String,
        owner: {
            type: Types.ObjectId,
            ref: 'User'
        }
    }]
});

module.exports = model('conversations', schema);