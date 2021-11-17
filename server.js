const express = require('express');
const fs = require('fs');
const path = require("path")

const PORT = process.env.PORT || 3017;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + './public/assets'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/assets/html/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/assets/html/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/assets/db/db.json"));
});


// POST
app.post("/api/notes", function (req, res) {
    const notes = req.body;
    fs.readFile(__dirname + "/public/assets/db/db.json", 'utf8', function noteTaker(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            obj.table.push(notes);
            json = JSON.stringify(obj);
            fs.writeFile(__dirname + "/public/assets/db/db.json", json, 'utf8', (err) => {
                if (err) throw err;
                console.log('Saved');
            });
        };
    });

    res.json(notes);
});


//DELETE
app.delete('/api/notes/:note', function (req, res) {
    const note = req.params.note;
    fs.read(__dirname + "/public/assets/db/db.json", 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);

            let objOne = obj.table.filter(function (e) {
                return e.id !== note;
            });
            let objTwo = { "table": objOne }
            json = JSON.stringify(objTwo);
            fs.writeFile(__dirname + "/public/assets/db/db.json", json, 'utf8', (err) => {
                if (err) throw err;
                console.log('File saved!');
            });
        }
    });
    res.json(newNote);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});