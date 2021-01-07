const express = require('express');
const router = express.Router();
const Joi = require('joi');
const db = require('../db/connection');
const notes = db.get('notes');

const schema = Joi.object({
    title: Joi.string().regex(/^\w+(?:\s+\w+)*$/).max(30).required(),
    content: Joi.string().required(),
    });

router.get('/', (req,res) => {
    notes.find({
        user_id: req.user._id
    }).then((notes) => {
        res.json(notes);
    });
});
router.post('/', (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error === undefined) {
        const note = {
            ...req.body,
            user_id: req.user._id
        };
        notes
            .insert(note)
            .then((note) => {
                res.json(note);
             });
    } else {
        const error = new Error(result.error);
        res.status(422);
        next(error);
    }
});

module.exports = router;

