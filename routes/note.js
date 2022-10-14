const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const mongoose = require('mongoose')
const auth = require('../auth/auth')
// get all
router.get('/note', auth.authenticateToken, auth.verifyAdmin, async (req, res) =>  {
    try {
        const notes = await Note.find()
        res.json(notes)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// get one
router.get('/note/:id', getNote, async (req, res) => {
    res.send(res.note)
    // error handling in getNote() method.
} )

// creating one
router.post('/note', async (req, res) => {
    const note = new Note({
        description: req.body.description,
        noteDate: req.body.noteDate
    })
    try {
        const newNote = await note.save()
        res.status(201).json(newNote)
    }   catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
} )

// updating one
router.put('/note/:id', getNote, async (req, res) => {
    if (req.body.description != null) {
        res.note.description = req.body.description
    }
    try {
        const updatedNote = await res.note.save()
        res.json(updatedNote)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
} )

// delete one
router.delete('/note/:id', getNote, async (req, res) => {
    try {
        await res.note.deleteOne()
        res.json({
            message: 'deleted note with id:' + res.note.id
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
} )

async function getNote(req, res, next) {
    let note;
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: 'not a valid ID:' + req.params.id
            })
        }
        note = await Note.findById(req.params.id)
        if (note == null || note == undefined) {
            return res.status(404).json({
                message: 'Cannot find note with ID:' + req.params.id
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
    res.note = note
    next()
}


module.exports = router