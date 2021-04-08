const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    body: {
        type: String
    },
    picture: {
        type: String,
        required: true
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        text: String,
        timestamp: String,
        owner: {
            type: Types.ObjectId,
            ref: 'User'
        }
    }]
}, {timestamps: true});

module.exports = model('Post', schema);