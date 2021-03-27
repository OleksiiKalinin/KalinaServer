const {Router} = require('express');
const router = Router();
const Conversations = require('../models/Convesation.js');
const auth = require('../middleware/auth.middleware');

router.post('/new/conversation', auth, (req, res) => {
    const dbData = req.body;

    Conversations.create(dbData, (err, data) => {
        if(err) {
            res.status(500).json(err);
        } else {
            res.status(201).json(data);
        }
    });
});

router.post('/new/message', auth, (req, res) => {
    Conversations.updateOne(
        { _id: req.query.id },
        { $push: {conversation: req.body} },
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
    Conversations.find((err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            data.sort((a, b) => {
                return a.timestamp - b.timestamp;
            });
            let conversations = [];
            data.map((cData) => {
                const conversationInfo = {
                    id: cData._id,
                    name: cData.chatName,
                    timestamp: cData.conversation[0].timestamp
                }

                conversations.push(conversationInfo);
            });
            res.set('Content-Type', 'application/json');
            res.status(200).json(conversations);
        }
    });
});

router.get('/get/conversation', auth, (req, res) => {
    const id = req.query.id;

    Conversations.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(data);
        }
    });
});

router.get('/get/lastMessage', auth, (req, res) => {
    const id = req.query.id;
    
    Conversations.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            let cData = data[0].conversation;

            cData.sort((a, b) => {
                return b.timestamp - a.timestamp;
            });
            
            res.status(200).json(cData[0]);
        }
    });
});

module.exports = router;