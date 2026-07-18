function dataFromMain() {
    window.electronAPI.send("getFS", {});

    window.electronAPI.on("fsResponse", (event, data) => {
        console.log(data);
    })
}

// Code to make a folder
//window.electronAPI.send("createFolder", {name: "a great name", parentPath: "notes"});

// Code to make a note
//window.electronAPI.send("createNote", { title: "Amazing note", parentPath: "notes" });

// Code to delete a note
window.electronAPI.send("deleteNote", { filePath: "thingy.md" });

