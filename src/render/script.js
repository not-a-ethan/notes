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

        const sumamry = document.createElement("summary");
        sumamry.innerText = thisFolder.name;

        dropDown.appendChild(sumamry);

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
        } else {
            // Child level notes
            const margin = ((thisFile.parentPath.split("/").length) - 3) * 5

            btn.style.marginLeft = `${margin}px`;

            const parentElm = document.getElementById(thisFile.parentPath);
            parentElm.appendChild(btn);
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
        } else {
            // Child level notes
            const margin = ((thisFile.parentPath.split("/").length) - 3) * 5

            btn.style.marginLeft = `${margin}px`;

            const parentElm = document.getElementById(thisFile.parentPath);
            parentElm.appendChild(btn);
        };
    };
});

// Code to make a folder
//window.electronAPI.send("createFolder", {name: "a great name", parentPath: "notes"});

// Code to make a note
//window.electronAPI.send("createNote", { title: "Amazing note", parentPath: "notes" });

// Code to delete a note
//window.electronAPI.send("deleteNote", { filePath: "thingy.md" });

