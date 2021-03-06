const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('displayName', 'Incorrect nickname').isLength({min: 4}),
        check('password', 'Incorrect password, minimal length is 6 symbols').isLength({min: 6})
    ],      
    async (req, res) => {
        try {
            const errors = validationResult(req);
            
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                });
            }
            const {email, displayName, password} = req.body;
            const candidate = await User.findOne({email: email});

            if (candidate) {
                return res.status(400).json({message: 'This email already exist!'})
            }
            
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, displayName, password: hashedPassword});

            await user.save();

            res.status(201).json({message: 'Success'});
        } catch (e) {
            res.status(500).json({message: 'Something goes wrong, try again'});
        }
});

router.post(
    '/login', 
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Incorrect password, minimal length is 6 symbols').isLength({min: 6})
    ],      
    async (req, res) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect email or password'
            });
        }
        
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: 'Incorrect email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: 'Incorrect email or password'});
        }
        
        const token = jwt.sign(
            {user: user},
            config.get('jwtSecret')
        );

        user.password = undefined;

        res.json({token, user});
    } catch (e) {
        res.status(500).json({message: 'Something goes wrong, try again'});
    }
});

module.exports = router;