"use strict";
const Electron = require("electron");
const electron_1 = require("electron");
const fs = require("fs");
function initializeBrowserWindowService(bw) {
    Electron.ipcMain.on("window-openDevTools", (event, options) => {
        bw.webContents.openDevTools(options);
    });
    Electron.ipcMain.on("window-reload", (event) => {
        bw.reload();
    });
}
exports.initializeBrowserWindowService = initializeBrowserWindowService;
function initializeDialogService() {
    Electron.ipcMain.on("dialog-showOpenDialog", (event, id, options) => {
        electron_1.dialog.showOpenDialog(options, (filenames) => {
            event.sender.send("dialog-showOpenDialog-reply", id, filenames);
        });
    });
    Electron.ipcMain.on("dialog-showSaveDialog", (event, id, options) => {
        electron_1.dialog.showSaveDialog(options, (filename) => {
            event.sender.send("dialog-showSaveDialog-reply", id, filename);
        });
    });
    Electron.ipcMain.on("dialog-showMessageBox", (event, id, options) => {
        electron_1.dialog.showMessageBox(options, (response) => {
            event.sender.send("dialog-showMessageBox-reply", id, response);
        });
    });
}
exports.initializeDialogService = initializeDialogService;
function initializeFileService() {
    Electron.ipcMain.on("file-open", (event, id, path, flags, mode) => {
        fs.open(path, flags, mode, (err, fd) => {
            event.sender.send("file-open-reply", id, err, fd);
        });
    });
    Electron.ipcMain.on("file-readFile", (event, id, filename, encoding) => {
        fs.readFile(filename, encoding, (err, data) => {
            event.sender.send("file-readFile-reply", id, err, data);
        });
    });
    Electron.ipcMain.on("file-read", (event, id, fd, buffer, offset, length, position) => {
        fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
            event.sender.send("file-read-reply", id, err, bytesRead, buffer);
        });
    });
    Electron.ipcMain.on("file-writeFile", (event, id, filename, data, options) => {
        function callback(err) {
            event.sender.send("file-writeFile-reply", id, err);
        }
        if (options) {
            fs.writeFile("filename", data, options, callback);
        }
    });
    Electron.ipcMain.on("file-write-string", (event, id, fd, data, position, encoding) => {
        fs.write(fd, data, position, (err, bytes, str) => {
            event.sender.send("file-write-string-reply", id, err, bytes, str);
        });
    });
    Electron.ipcMain.on("file-write-buffer", (event, id, fd, data, offset, length, position) => {
        fs.write(fd, data, offset, length, position, (err, bytes, buffer) => {
            event.sender.send("file-write-buffer-reply", id, err, bytes, buffer);
        });
    });
}
exports.initializeFileService = initializeFileService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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
