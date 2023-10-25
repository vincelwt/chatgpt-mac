
const { ipcRenderer } = require('electron');

const shortcutInput = document.getElementById('shortcutInput');
const saveButton = document.getElementById('saveButton');

const displayShortcut = async () => {
    await ipcRenderer.send('get-shortcut')
    await ipcRenderer.on('shortcut-data', (event, currentShortcut) => {
        shortcutInput.value = currentShortcut
    });
}

displayShortcut()

saveButton.addEventListener('click', () => {
    const newShortcut = shortcutInput.value;
    ipcRenderer.send('update-shortcut', newShortcut)
});
