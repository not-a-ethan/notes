const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('node:fs');
const homedir = require('os').homedir();

// If notes folder does not exist, create it
if (!fs.existsSync(path.join(homedir, "notes"))) {
    fs.mkdirSync(path.join(homedir, "notes"), true);
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        //preload: path.join(__dirname, "setup.js")
    }
  });

  win.loadFile('src/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})