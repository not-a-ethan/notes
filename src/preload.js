const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    send: (event, data) => ipcRenderer.send(event, data),
    on: (event, data) => ipcRenderer.on(event, data),
    requestSave: (callback) => ipcRenderer.on("request-save", (event, value) => callback(value))
})