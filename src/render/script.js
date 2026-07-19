window.electronAPI.send("getFS", {});

const fileTree = document.getElementById("fs");

// Render file structure
window.electronAPI.on("fsResponse", (event, data) => {
    console.log(data);

    const folders = data["folders"];
    const mdFiles = data["markdown"];
    const otherFiles = data["other"];
    const rootNotes = data["root"];

    // Render folders
    for (let i = 0; i < folders.length; i++) {
        const thisFolder = folders[i];

        const dropDown = document.createElement("details");
        dropDown.id = `${thisFolder.parentPath}/${thisFolder.name}`;
        dropDown.className = "folder"

        const summary = document.createElement("summary");
        summary.innerText = thisFolder.name;
        summary.className = "folderName"

        dropDown.appendChild(summary);

        if (rootNotes === thisFolder.parentPath) {
            // Root level folders
            fileTree.appendChild(dropDown);
        } else {
            // Child level folders
            const margin = ((thisFolder.parentPath.split("/").length) - 3) * 5

            dropDown.style.marginLeft = `${margin}px`;

            const parentElm = document.getElementById(thisFolder.parentPath);
            parentElm.appendChild(dropDown);
        };
    };

    // Render md files
    for (let i = 0; i < mdFiles.length; i++) {
        const thisFile = mdFiles[i];

        const btn = document.createElement("button");
        btn.innerText = (thisFile.name).substring(0, thisFile.name.length - 3);
        btn.className = "file mdFile";

        if (thisFile.parentPath === rootNotes) {
            // Root level notes
            fileTree.appendChild(btn);
            fileTree.appendChild(document.createElement("br"));
        } else {
            // Child level notes
            const margin = ((thisFile.parentPath.split("/").length) - 3) * 5

            btn.style.marginLeft = `${margin}px`;

            const parentElm = document.getElementById(thisFile.parentPath);
            parentElm.appendChild(btn);
            parentElm.appendChild(document.createElement("br"));
        };
    };

    // Render non md files
    for (let i = 0; i < otherFiles.length; i++) {
        const thisFile = otherFiles[i];

        const btn = document.createElement("button");
        btn.innerText = thisFile.name;
        btn.className = "file otherFile";

        if (thisFile.parentPath === rootNotes) {
            // Root level notes
            fileTree.appendChild(btn);
            fileTree.appendChild(document.createElement("br"));
        } else {
            // Child level notes
            const margin = ((thisFile.parentPath.split("/").length) - 3) * 5

            btn.style.marginLeft = `${margin}px`;

            const parentElm = document.getElementById(thisFile.parentPath);
            parentElm.appendChild(btn);
            parentElm.appendChild(document.createElement("br"));
        };
    };
});

// Functions to create new md files
function createFileNameInput(e) {
    e.preventDefault();

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "newFileName"

    fileTree.append(nameInput);

    document.getElementById("newFileName").focus();

    handleNewFileName();
};

function createFile() {
    const input = document.getElementById("newFileName");

    if (input.value.trim().length === 0) {
        input.remove()

        return;
    };

    window.electronAPI.send("createNote", { title: input.value, parentPath: "notes" });

    input.remove()
};

function handleNewFileName() {
    const input = document.getElementById("newFileName");

    input.addEventListener("focusout", (e) => {
        createFile();

        return;
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            createFile();

            return;
        };
    });
};

document.getElementById("createFile").addEventListener("click", createFileNameInput)

// Functions to create new folders
function createFolderNameInput(e) {
    e.preventDefault();

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "newFolderName"

    fileTree.append(nameInput);

    document.getElementById("newFolderName").focus();

    handleNewFolderName();
};

function createFolder() {
    const input = document.getElementById("newFolderName");

    if (input.value.trim().length === 0) {
        input.remove()

        return;
    };

    window.electronAPI.send("createFolder", { name: input.value, parentPath: "notes" });

    input.remove()
};

function handleNewFolderName() {
    const input = document.getElementById("newFolderName");

    input.addEventListener("focusout", (e) => {
        createFolder();

        return;
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            createFolder();
            
            return;
        };
    });
};

document.getElementById("createFolder").addEventListener("click", createFolderNameInput)

// Code to make a folder
//window.electronAPI.send("createFolder", { name: "a great name", parentPath: "notes" });

// Code to make a note
//window.electronAPI.send("createNote", { title: "Amazing note", parentPath: "notes" });

// Code to delete a note
//window.electronAPI.send("deleteNote", { filePath: "thingy.md" });

