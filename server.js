const express = require('express');
const fs = require('fs');
const path = require("path")

const PORT = process.env.PORT || 3022;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let idCount = 1;
const notesD = path.join(__dirname, 'db', 'db.json');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


app.get('/api/notes', function (req, res) {
    fs.readFile(notesD, (err, data) => {
        const noteOne = noNote(err, data);
        res.json(noteOne);
    });
});


app.post('/api/notes', function (req, res) {
    const notes = req.body;
    fs.readFile(notesD, (err, data) => {
        const noteOne = noNote(err, data);
        addNote(notes, noteOne);
        writeAndSendNotes(noteOne, res);
    });
});



app.delete('/api/notes/:id', function (req, res) {
    const id = parseInt(req.params.id);
    fs.readFile(notesD, (err, data) => {
        const noteOne = noNote(err, data);
        deleteNote(id, noteOne);
        writeAndSendNotes(noteOne, res);
    });
});


function writeAndSendNotes(secondNote, res) {
    const jsonS = JSON.stringify(secondNote);
    fs.writeFile(notesD, jsonS, (err) => {
        if (err) throw err;
        res.json(secondNote);
    });
}
function noNote(err, data) {
    if (err) throw err;
    return JSON.parse(data);
}
function addNote(notes, noteOne) {


    notes.id = idCount++;
    noteOne.push(notes);
}
function deleteNote(id, noteOne) {
    let noteIndex;
    noteOne.forEach(function (note, index) {
        if (note.id === id) {
            noteIndex = index;
        }
    });
    noteOne.splice(noteIndex, 1);
}


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});