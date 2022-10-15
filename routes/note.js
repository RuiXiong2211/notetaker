const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const mongoose = require('mongoose')
const Redis = require('ioredis')
const DEFAULT_EXPIRATION = 3600

const redisKey = "notes"
const redisClient =  new Redis()

// redisClient.connect().then(() => {
//     console.log("redis connected")
// })

//await redisClient.connect()

// get all
router.get('/note', async (req, res) =>  {
    try {
        const cacheData = await getCache(redisKey)
        if (cacheData === undefined) {
            const notes = await Note.find()
            await setCache(redisKey, JSON.stringify(notes))
            res.json(notes)
        } else {
            res.json(cacheData)
        }
        //const notes = await Note.find()
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

// function getOrSetCache(key, cb) {
//     return new Promise((resolve, reject) => {
//         redisClient.get(key, async(error, data) => {
//             console.log("enter method")
//             if (error) {
//                 console.log(error)
//                 return reject(error)
//             }
//             if (data != null) {
//                 return resolve(JSON.parse(data))
//             }
//             const freshData = await cb()
//             redisClient.setEx(key, DEFAULT_EXPIRATION, freshData)
//         })
//     })
// }

async function getCache(key) {
    let note = undefined;
        await redisClient.get(key, (err, result) => {
        if (err) {
            console.log(err)
        }
        //console.log("key is", key)
        //console.log("data is", result)
        if (result) {
            note = result
        }
    })
    return note;
}

async function setCache(key, value) {
    await redisClient.set(key, value)
}


module.exports = router