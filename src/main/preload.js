const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('videoInfo', {
    openFileDialog: () => {
        ipcRenderer.send('open:file-dialog');
    },
    onFileSelected: (callback) => {
        ipcRenderer.on('file:selected', (event, filePath) => {
            callback(filePath);
        });
    },
    processVideo: (filePath) => {
        ipcRenderer.send('process:video', filePath);
    },
    receiveVideoMetadata: (callback) => {
        ipcRenderer.on('video:metadata', (event, duration) => {
            callback(duration);
        });
    }
});