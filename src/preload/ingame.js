const {ipcRenderer} = require('electron');
eval(ipcRenderer.sendSync('src'));
