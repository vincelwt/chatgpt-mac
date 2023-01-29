const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    formSubmit: (event, value) => { 
        ipcRenderer.send('formSubmit', value);
    }
})