const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: 'https://res.cloudinary.com/kalina-why-not/image/upload/v1617533877/bthe3vt3icrxrfhoh4ob.png'
    },
    followers: [{
        type: Types.ObjectId,
        ref: 'Link'
    }],
    following: [{
        type: Types.ObjectId,
        ref: 'Link'
    }]
})

module.exports = model('User', schema);