const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('YourAPI',
{
  formSubmitEvent: (value) => {
    alert("formSubmitEvent: " + value);
    ipcRenderer.sendToHost(value);
  }
});
     
