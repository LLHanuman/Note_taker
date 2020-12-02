const noteData = require("../db/db");
const uniqid = require("uniqid");
const fs = require("fs");

module.exports = function(app) {
    // API GET Requests
    // ---------------------------------------------------------------------------

    app.get("/api/notes", function(req, res) {
        res.json(noteData);
    });

    app.get("/api/notes/:noteData", function(req, res) {
        var select = req.params.noteData;
        for (var i = 0; i < noteData.length; i++) {
            if (select === noteData[i].id) {
                return res.json(noteData[i]);
            }
        }
        return;
    });

    // API POST Request
    // ---------------------------------------------------------------------------

    app.post("/api/notes", function(req, res) {
        newNote = req.body;
        newNote.id = uniqid.time();
        noteData.push(newNote);
        res.json(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(noteData), function(err) {
            if (err) throw err;
        });
    });

    // API DELETE Request
    // ---------------------------------------------------------------------------
    app.delete("/api/notes/:noteID", function(req, res) {
        var selectedNote = req.params.noteID;
        console.log(selectedNote);
        for (var i = 0; i < noteData.length; i++) {
            if (selectedNote === noteData[i].id) {
                noteData.splice(i, 1);
                fs.writeFile("./db/db.json", JSON.stringify(noteData), function(err) {
                    if (err) throw err;
                });
                return res.json(noteData);
            }
        }
    });
};