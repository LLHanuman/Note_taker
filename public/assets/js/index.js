const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Pull notes from
const getNotes = () => {
    return $.ajax({
        url: "/api/notes",
        method: "GET",
    });
};

// Save note
const saveNote = (note) => {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST",
    });
};



// Show active note, or new note
const renderActiveNote = () => {
    $saveNoteBtn.hide();

    if (activeNote.id) {
        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
    } else {
        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val("");
    }
};
const handleNoteView = function() {
    activeNote = $(this).data();
    renderActiveNote();
};

// Add new note to screen
const handleNoteSave = function() {
    const newNote = {
        title: $noteTitle.val(),
        text: $noteText.val(),
    };

    saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};
const handleNewNoteView = function() {
    activeNote = {};
    renderActiveNote();
};

// Delete note
const handleNoteDelete = function(event) {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    event.stopPropagation();

    const note = $(this).parent(".list-group-item").data();

    if (activeNote.id === note.id) {
        activeNote = {};
    }

    deleteNote(note.id).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};
const deleteNote = (id) => {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE",
    });
};


// if no new note, hide save button
const handleRenderSaveBtn = function() {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};

// Show note title list
const renderNoteList = (notes) => {
    $noteList.empty();

    const noteListItems = [];

    // Returns li delete button unless delete button = false
    const create$li = (text, withDeleteButton = true) => {
        const $li = $("<li class='list-group-item'>");
        const $span = $("<span>").text(text);
        $li.append($span);

        if (withDeleteButton) {
            const $delBtn = $(
                "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
            );
            $li.append($delBtn);
        }
        return $li;
    };

    if (notes.length === 0) {
        noteListItems.push(create$li("No saved Notes", false));
    }

    notes.forEach((note) => {
        const $li = create$li(note.title).data(note);
        noteListItems.push($li);
    });

    $noteList.append(noteListItems);
};

// Adds notes to side bar
const getAndRenderNotes = () => {
    return getNotes().then(renderNoteList);
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();