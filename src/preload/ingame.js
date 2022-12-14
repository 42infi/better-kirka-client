const {clipboard, ipcRenderer} = require('electron');
eval(ipcRenderer.sendSync('src'));