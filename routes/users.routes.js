const {Router} = require('express');
const router = Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

router.get('/get/user/:id', auth, (req, res) => {
    User.findOne({_id: req.params.id})
    .select('-password')
    .then(user => {
        Post.find({owner: req.params.id})
        .populate('owner', '_id displayName')
        .exec((err, posts) => {
            if (err) {
                return res.status(422).json({error: err});
            }
            res.json({user, posts});
        });
    })
    .catch(err => {
        return res.status(404).json({error: 'User not found'});
    });
});

router.get('/get/users', auth, (req, res) => {
    let allId = [];
    User.find()
    .then(users => {
        users.map(user => allId.push(user._id))
        res.json(allId);
    })
    .catch(err => {
        return res.status(404).json({error: 'User not found'});
    });
});

router.put('/put/follow', auth, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    }, {new: true}, (err) => {
        if (err) {
            return res.status(422).json({error: err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        }, {new: true})
        .select('-password')
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            return res.status(422).json({error: err});
        });
    });
});

router.put('/put/unfollow', auth, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers: req.user._id}
    }, {new: true}, (err) => {
        if (err) {
            return res.status(422).json({error: err});
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.unfollowId}
        }, {new: true})
        .select('-password')
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            return res.status(422).json({error: err});
        });
    });
});

router.get('/get/myfollowdata', auth, (req, res) => {
    User.findOne({_id: req.user._id})
    .select('followers following')
    .then(user => {
        res.json({followers: user.followers, following: user.following});
    })
    .catch(err => {
        return res.status(404).json({error: 'User not found'});
    });
});

router.put('/put/profileImg', auth, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {profileImg: req.body.picture}
    }, {new: true}, (err, user) => {
        if (err) {
            return res.status(422).json({error: err});
        }
        res.json(user);
    });
});

router.post('/post/users-search', auth, (req, res) => {
    let userPattern = new RegExp("^" + req.body.query);
    User.find({displayName: {$regex: userPattern}})
    .select("_id profileImg displayName")
    .then(user => {
        res.json(user);
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = router;