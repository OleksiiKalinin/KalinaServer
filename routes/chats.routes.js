const {Router} = require('express');
const router = Router();
const Conversations = require('../models/Convesation.js');
const auth = require('../middleware/auth.middleware');
const User = require('../models/User.js');

router.post('/new/conversation', auth, (req, res) => {
    let newConvData = {
        chatName: req.body.chatName || '',
        participants: [req.user._id, req.body.other],
    }
    
    Conversations.create(newConvData, (err, data) => {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(201).json(data);
        }
    });
               
});

router.post('/new/message', auth, (req, res) => {
    const {message, timestamp} = req.body;

    Conversations.updateOne(
        { _id: req.query.id },
        { $push: {conversation: {message, timestamp, owner: req.user._id}}},
        (err, data) => {
            if(err) {
                res.status(500).json(err);
            } else {
                res.status(201).json(data);
            }
        }
    );
});

router.get('/get/conversations', auth, (req, res) => {
    Conversations.find({participants: {$in: req.user._id}})
    .then(async chats => {
        chats.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });
        
        let conversations = [];

        for(let i = 0; i < chats.length; ++i) {
            let conversationInfo = {
                id: chats[i]._id,
                name: chats[i].chatName,
                chatImg: chats[i].chatImg,
                timestamp: chats[i].conversation[0].timestamp,
                extra: []
            };

            for(let j = 0; j < chats[i].participants.length; ++j) {
                const user = await User.findOne({_id: chats[i].participants[j]});

                conversationInfo.extra.push({
                    id: user._id,
                    displayName: user.displayName,
                    profileImg: user.profileImg
                });
            }

            conversations.push(conversationInfo);
        }
        
        res.json(conversations);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

router.get('/get/conversation', auth, (req, res) => {
    Conversations.findOne({ _id: req.query.id })
    .populate('conversation.owner', '_id displayName profileImg')
    .then(chats => {
        res.json(chats);
    })
    .catch(err => console.log(err));
});

router.get('/get/lastMessage', auth, (req, res) => {
    Conversations.find({ _id: req.query.id })
    .populate('conversation.owner', '_id displayName')
    .then(data => {
        let cData = data[0].conversation;

        cData.sort((a, b) => b.timestamp - a.timestamp);
        
        res.json(cData[0]);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;