const { app, BrowserWindow, ipcMain, dialog } = require('electron/main');
const path = require('node:path');
const ffmpeg = require('fluent-ffmpeg');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    console.log('App is ready');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.on('open:file-dialog', (event) => {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Videos', extensions: ['mp4', 'avi', 'mkv', 'mov'] }]
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            // Send the selected file path back to renderer to update the form
            mainWindow.webContents.send('file:selected', filePath);
        }
    }).catch(err => {
        console.error('Error opening file dialog:', err);
    });
});

ipcMain.on('process:video', (event, filePath) => {
    console.log('Processing video: ', filePath);
    ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
            console.error('Error processing video:', err);
            mainWindow.webContents.send('video:metadata', 'Error processing video');
            return;
        }
        console.log('Video duration is: ', metadata.format.duration);
        mainWindow.webContents.send('video:metadata', metadata.format.duration);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});