const { menubar } = require("menubar");
const Nucleus = require("nucleus-analytics");

const path = require("path");
const {
  app,
  nativeImage,
  Tray,
  Menu,
  globalShortcut,
  shell,
} = require("electron");
const contextMenu = require("electron-context-menu");

const image = nativeImage.createFromPath(
  path.join(__dirname, `../images/newiconTemplate.png`)
);

let mb = null

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
  
      globalShortcut.register("CommandOrControl+Shift+g", () => {
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
  
      Menu.setApplicationMenu(menu);
  
      // open devtools
      // window.webContents.openDevTools();
  
      console.log("Menubar app is ready.");
    });

    return mb
}

module.exports = {
    createMenubar
}