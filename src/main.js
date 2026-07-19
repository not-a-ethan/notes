const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('node:fs');
const homedir = require('os').homedir();

// If notes folder does not exist, create it
if (!fs.existsSync(path.join(homedir, "notes"))) {
    fs.mkdirSync(path.join(homedir, "notes"), true);
};

function getNotes() {
  const res = fs.readdirSync(path.join(homedir, "notes"), { recursive: true, withFileTypes: true });

  const folders = res.filter((item) => !item.isFile());
  const mdFiles = res.filter((item) => item.name.substring(item.name.length - 3) == ".md");
  const otherFiles = res.filter((item) => item.name.substring(item.name.length - 3) !== ".md" && item.isFile());


  return {
    folders: folders,
    markdown: mdFiles,
    other: otherFiles,
    root: path.join(homedir, "notes")
  };
};

function createNote(name, parentPath) {
  fs.writeFileSync(path.join(homedir, parentPath, `${name}.md`), "", err => {
    if (e) {
      console.error(e)
    }
  });
};

function createFolder(name, parentPath) {
  try {
    fs.mkdirSync(path.join(homedir, parentPath, name));
  } catch (e) {
    console.error(e);
    return false;
  };

  return true;
};

function deleteNote(filePath) {
  if (!fs.existsSync(path.join(homedir, "notes", filePath))) {
    return false;
  } else {
    try {
      fs.rmSync(path.join(homedir, "notes", filePath));
    } catch (e) {
      console.error(e);

      return false;
    };
  }

  return true;
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        //preload: path.join(__dirname, "setup.js")
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "preload.js")
    },
  });

  win.loadFile('src/render/index.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('getFS', (event, payloadFromRenderer) => {
    const stuff = getNotes();

    event.reply("fsResponse", stuff);
  });

  ipcMain.on("createFolder", (event, payloadFromRenderer) => {
    if (!createFolder(payloadFromRenderer["name"], payloadFromRenderer["parentPath"])) {
      event.reply("createFolderResponse", "Something went wrong created folder");
    } else {
      event.reply("createFolderResponse", "It worked");
    };
  });

  ipcMain.on("createNote", (event, payloadFromRenderer) => {
    if (!createNote(payloadFromRenderer["title"], payloadFromRenderer["parentPath"])) {
      event.reply("createNoteResponse", "Something went wrong creating the note");
    } else {
      event.reply("createNoteResponse", "It worked");
    };
  });
  
  ipcMain.on("deleteNote", (event, payloadFromRenderer) => {
    if (!deleteNote(payloadFromRenderer["filePath"])) {
      event.reply("deleteNoteResponse", "Something went wrong deleting the note");
    } else {
      event.reply("deleteNoteResponse", "It worked")
    };
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})