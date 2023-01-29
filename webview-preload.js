const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('YourAPI',
{
  formSubmitEvent: (value) => {
    const res = ipcRenderer.sendToHost('submitForm', value);
  }
});
     
