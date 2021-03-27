const {Router} = require('express');
const router = Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth.middleware');

router.post('/new/post', auth, async (req, res) => {
    try {
        const {title, body, picture} = req.body;
        req.user.password = undefined;

        if (!title || !body || !picture) {
            return res.status(422).json({message: 'Please, enter all the fields'})
        }
        
        const post = new Post({title, body, picture, owner: req.user});

        await post.save();
        

        res.status(201).json({post});
    } catch (e) {
        res.status(500).json({message: 'Something goes wrong, try again'});
    }
});

router.get('/get/posts', auth, (req, res) => {
    Post.find()
    .populate('owner', '_id displayName')
    .then(posts => {
        res.json({posts});
    })
    .catch(err => console.log(err));
});

router.get('/get/myposts', auth, (req, res) => {
    Post.find({owner: req.user._id})
    .populate('owner', '_id displayName')
    .then(posts => {
        res.json({posts});
    })
    .catch(err => console.log(err));
});

router.put('/put/like', auth, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes: req.user._id}
    }, {new: true})
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({error: err});
        } else {
            res.json(result);
        }
    });
});

router.put('/put/unlike', auth, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes: req.user._id}
    }, {new: true})
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({error: err});
        } else {
            res.json(result);
        }
    });
});

module.exports = router;