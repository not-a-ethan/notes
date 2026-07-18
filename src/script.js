// const { ipcRenderer } = require('electron');

function dataFromMain() {
    const data = {};

    window.electronAPI.send("request-data-from-main", data);

    window.electronAPI.on("data-from-main-response", (event, data) => {
        console.log(data);
    })
}

dataFromMain();