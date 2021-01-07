const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const users = db.get('users');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const schema = Joi.object({
    username: Joi.string()
        .regex(/(^[a-zA-Z0-9_]*$)/)
        .min(2)
        .max(30),
    password: Joi.string()
        .trim()
        .min(10),
    role: Joi.string().valid('user', 'admin'),
    active: Joi.bool(),

    });
/*
 router.get('/', async (req,res) => {
    try {
        const result = await users.find({}, '-password');
        res.json(result);
    }
    catch { next(error); }
 });
*/


router.get('/',async (req,res,next) => {
    try {
        const result = await users.find({}, '-password')
        res.json(result);
    } catch (error) { next(error); }    
});
router.patch('/:id', async (req,res,next) => {
    const { id: _id } = req.params;
    try {
        const result = schema.validate(req.body);
        const query = { _id };
        if (result.error === undefined) {
            const user = await users.findOne(query);
                if (user) {
                    // if the requested id belongs to a user
                        // then update that user with the req.body!
                    const updatedUser = req.body
                    if (updatedUser.password) {
                        updatedUser.password = await bcrypt.hash(updateUser.password, 12);
                    }
                    const result = await users.findOneAndUpdate(query,{
                        $set: updatedUser
                    });
                    delete updatedUser.password;
                    res.json(result);
                } else {
                    next();
                }    
        } else {
            res.status(422);
            throw new Error(result.error);
        }   
    } catch (error) {
        next(error);
    }
});
module.exports = router;
