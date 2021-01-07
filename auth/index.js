const express = require('express');
const router = express.Router();
const Joi = require('joi');
const db = require('../db/connection');
const users = db.get('users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

users.createIndex('username', { unique: true });

const schema = Joi.object({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: Joi.string().trim().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.ref('password'),
    email: Joi.string().email()
})

router.post('/signup', (req,res,next) => {
    const result = schema.validate(req.body);
    if (result.error === undefined) {
        users.findOne({
            username: req.body.username
        }).then( user => {
            if (user) {
                const error = new Error('This name is not OG. please choose another one.');
                res.status(409);
                next(error);
            } else {
                bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
                    const newUser = {
                        username: req.body.username,
                        password: hashedPassword,
                        role: 'user',
                        active: true
                    };
                    users.insert(newUser).then(insertedUser => {
                        delete insertedUser.password;
                        res.json(insertedUser);
                    });
                });
            }
        });

    } else {
        res.status(422);
        next(result.error);
    }
       
});
function Error422(res,next) {
    res.status(422);
    const error = new Error('Unable to login');
    next(error);
}

router.post('/login', (req,res,next) => {
    const result = schema.validate(req.body);
    if (result.error === undefined) {
        users.findOne({ username: req.body.username })
        .then(user => {
            if (user && user.avtive) {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((result) => {
                        if (result) {
                            const payload = {
                                username: user.username,
                                _id: user._id,
                                role: user.role,
                                active: user.active
                            };
                            jwt.sign(payload, process.env.TOKEN_SECRET, {
                            expiresIn: '1d'
                            },
                            (err,token) => {
                                if (err) {Error422(res,next);}
                                else { res.json(token); }
                            });
                        } else {Error422(res,next);}
                    });
            } else {Error422(res,next);}
        });
    } else {Error422(res,next);}
    
});

module.exports = router;
