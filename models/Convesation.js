const {Schema, model, Types} = require('mongoose');

const schema = Schema({
    chatName: {
        type: String,
        default: null
    },
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
    }],
    chatImg: {
        type: String,
        default: 'https://res.cloudinary.com/kalina-why-not/image/upload/v1617533877/bthe3vt3icrxrfhoh4ob.png'
    }
});

module.exports = model('conversations', schema);