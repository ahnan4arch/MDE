
import {app, BrowserWindow} from "electron"
import * as Server from "./server"

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800, 
        height : 600,
        minWidth: 300,
        minHeight: 300,
    });
    
    win.loadURL("file://" + __dirname + "/../index.html");
    
    win.webContents.openDevTools();

    Server.initializeBrowserWindowService(win);
    Server.initializeDialogService();
    Server.initializeFileService();
    
    win.on('closed', ()=> {
        win = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
})
