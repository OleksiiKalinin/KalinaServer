const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
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
    }]
});

module.exports = model('Post', schema);