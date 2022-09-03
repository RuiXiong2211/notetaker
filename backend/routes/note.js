const express = require('express')
const router = express.Router()
const Note = require('../models/note')

// get all
router.get('/', async (req, res) =>  {
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
router.get('/:id', async (req, res) => {
    res.send(req.params.id)
} )

// creating one
router.post('/', async (req, res) => {
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
router.patch('/:id', (req, res) => {
    
} )

// delete one
router.delete('/:id', (req, res) => {
    
} )


module.exports = router