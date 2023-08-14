const { 
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut
} = require('electron');

const settings = require('electron-settings');

// for first time turn on the app or removed shortcut by accident
const initializeShortcut = () => {
    settings.setSync('shortcut', 'CommandOrControl+Shift+g')
}

const hasShortcutInSettings = () => {
    return settings.hasSync('shortcut')
}

const getShortcutFromSettings = () => {
    if (hasShortcutInSettings()) {
        return settings.getSync('shortcut')
    } else {
        return ''
    }
}

// set shortcut into local storge and unregister the old one
const setShortcutInSettings = (newShortcut) => {
    const oldShortcut = settings.getSync('shortcut')
    if (settings.hasSync('shortcut')) {
        globalShortcut.unregister(oldShortcut)
        settings.unsetSync('shortcut')
    }

    if (newShortcut != '') {
        settings.setSync('shortcut', newShortcut)
        console.log('Shortcut set successful, old: ' + oldShortcut + ' - new: ' + newShortcut + '. Make sure the shortcut has been reloaded.')
    } else {
        console.log('empty shortcut!')
    }
}

const openSettingsWindow = () => {
    app.whenReady().then(() => {
        settingsWindow = new BrowserWindow({
            width: 400,
            height: 300,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
        });

        // keep it for turn on devtools
        // settingsWindow.webContents.openDevTools();

        settingsWindow.loadFile('./pages/settings/index.html'); 
    });
}

module.exports = {
    initializeShortcut,
    hasShortcutInSettings,
    getShortcutFromSettings,
    setShortcutInSettings,
    openSettingsWindow,
}