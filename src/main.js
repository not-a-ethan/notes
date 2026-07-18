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
    other: otherFiles
  };
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

  win.loadFile('src/index.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('request-data-from-main', (event, payloadFromRenderer) => {
    const stuff = getNotes();

    event.reply("data-from-main-response", stuff)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})