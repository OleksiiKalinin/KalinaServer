const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({message: 'No authorization'});
        } 

        jwt.verify(token, config.get('jwtSecret'), (error, payload) => {
            if (error) {
                return res.status(401).json({message: 'No authorization'});
            }

            User.findById(payload.user._id)
            .then(userData => {
                req.user = userData;
                next();
            })
        });
    } catch (e) {
        res.status(401).json({message: 'No authorization'});
    }
}