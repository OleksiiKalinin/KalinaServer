const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    body: {
        type: String,
        required: true
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
        owner: {
            type: Types.ObjectId,
            ref: 'User'
        }
    }]
});

module.exports = model('Post', schema);