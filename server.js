const express = require('express');
const mongoose = require('mongoose');
const Pusher = require('pusher');
const Cors = require('cors');
const config = require('config');

const app = express();
const port = process.env.PORT || 5000;

const pusher = new Pusher({
    appId: "1150619", 
    key: "b634efb073fba40fbf3a",
    secret: "2c14fcb59e459b00aa13",
    cluster: "eu",
    useTLS: true
  });
  
mongoose.connection.once('open', () => {
    console.log('db connected');
    const changeStream = mongoose.connection.collection('conversations').watch();

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger("chats", "newChat", {
                'change': change
            });
        } else if(change.operationType === 'update'){
            pusher.trigger("messages", "newMessage", {
                'change': change
            });   
        } else {
            console.log('error triggering Pusher');
        }
    });
});

app.use(express.json({extended: true}));

app.use(Cors());

app.get('/', (req, res) => res.status(200).json('Hello world'));

app.use('/api/chats', require('./routes/chats.routes'));

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/posts', require('./routes/posts.routes'));

app.use('/api/users', require('./routes/users.routes'));


(async () => {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(port, () => console.log('server started')); 
    } catch {
        console.log('Server error', e.message);
        process.exit(1);
    }
})();
  