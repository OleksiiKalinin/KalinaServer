const {Router} = require('express');
const router = Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth.middleware');

router.post('/new/post', auth, async (req, res) => {
    try {
        const {title, body} = req.body;
        req.user.password = undefined;

        if (!title || !body) {
            return res.status(422).json({message: 'Something goes wrong, try again'})
        }
        
        const post = new Post({title, body, owner: req.user});

        await post.save();
        
        console.log(post)

        res.status(201).json({message: 'Success'});
    } catch (e) {
        res.status(500).json({message: 'Something goes wrong, try again'});
    }
});

module.exports = router;