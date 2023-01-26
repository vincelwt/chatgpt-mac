const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    formSubmit: (value) => ipcRenderer.send('submitForm', value)
})