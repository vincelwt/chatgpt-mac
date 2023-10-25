const { menubar } = require("menubar");

const path = require("path");

const {
  app,
  nativeImage,
  Tray,
  Menu,
  globalShortcut,
  shell,
  ipcMain,
} = require("electron");

const settings = require('electron-settings');

const {
    initializeShortcut,
    hasShortcutInSettings,
    getShortcutFromSettings,
    setShortcutInSettings,
    openSettingsWindow,
   } = require('../pages/settings')

const image = nativeImage.createFromPath(
  path.join(__dirname, `../images/newiconTemplate.png`)
);

let mb = null

// handles the reloading of this application shortcut.
const reloadShortcut = () => {
    const { window } = mb;

    if (!hasShortcutInSettings()) {
        initializeShortcut()
    }

    // Register a global shortcut using the shortcut obtained from the application settings.
    globalShortcut.register(getShortcutFromSettings(), () => {
    if (window.isVisible()) {
        mb.hideWindow();
    } else {
        mb.showWindow();
        if (process.platform == "darwin") {
        mb.app.show();
        }
        mb.app.focus();
    }
    });
}

// Initialize Menubar browser for loading chatgpt
const createMenubar = () => {
    const tray = new Tray(image);

    mb = menubar({
      browserWindow: {
        icon: image,
        transparent: path.join(__dirname, `../images/iconApp.png`),
        webPreferences: {
          webviewTag: true,
          // nativeWindowOpen: true,
        },
        width: 450,
        height: 550,
      },
      tray,
      showOnAllWorkspaces: true,
      preloadWindow: true,
      showDockIcon: false,
      icon: image,
    });
  
    mb.on("ready", () => {
      const { window } = mb;
  
      if (process.platform !== "darwin") {
        window.setSkipTaskbar(true);
      } else {
        app.dock.hide();
      }
  
      const contextMenuTemplate = [
        // add links to github repo and vince's twitter
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            app.quit();
          },
        },
        {
          label: "Reload",
          accelerator: "Command+R",
          click: () => {
            window.reload();
          },
        },
        {
          label: "Open in browser",
          click: () => {
            shell.openExternal("https://chat.openai.com/chat");
          },
        },
        {
          label: "Settings",
          click: () => {
            listenEditShortcut()
            openSettingsWindow()
          },
        },
        {
          type: "separator",
        },
        {
          label: "View on GitHub",
          click: () => {
            shell.openExternal("https://github.com/vincelwt/chatgpt-mac");
          },
        },
        {
          label: "Author on Twitter",
          click: () => {
            shell.openExternal("https://twitter.com/vincelwt");
          },
        },
      ];
  
      tray.on("right-click", () => {
        mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate));
      });
  
      tray.on("click", (e) => {
        //check if ctrl or meta key is pressed while clicking
        e.ctrlKey || e.metaKey
          ? mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate))
          : null;
      });
      const menu = new Menu();

      reloadShortcut()
  
      Menu.setApplicationMenu(menu);
  
      // open devtools
      // window.webContents.openDevTools();

      if (process.platform == "darwin") {
        // restore focus to previous app on hiding
        mb.on("after-hide", () => {
          mb.app.hide();
        });
      }
  
      console.log("Menubar app is ready.");
    });

    return mb
}

// Listen for IPC requests for front-end related to shortcuts such as getting or updating current short
const listenEditShortcut = () => {
    ipcMain.on('get-shortcut', (event) => {
        event.reply('shortcut-data', getShortcutFromSettings());
    });

    ipcMain.on('update-shortcut', (event, newShortcut) => {
        setShortcutInSettings(newShortcut)
        reloadShortcut()
    });
}

module.exports = {
    createMenubar
}