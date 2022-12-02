const { menubar } = require("menubar");

const path = require("path");
const { app, nativeImage, shell, Menu, MenuItem } = require("electron");

const image = nativeImage.createFromPath(
  path.join(__dirname, `images/newiconTemplate.png`)
);

// function getTrayIcon(isDark = nativeTheme.shouldUseDarkColors) {
//   // some logic to determine what icon to use
//   console.log(path.join(__dirname, `icon-tray${isDark ? "-dark" : ""}.png`));
//   return path.join(__dirname, `icon-tray${isDark ? "-dark" : ""}.png`);
// }

// app.on("ready", () => {

const mb = menubar({
  browserWindow: {
    icon: image,
    transparent: path.join(__dirname, `images/iconApp.png`),
    webPreferences: {
      webviewTag: true,
      nativeWindowOpen: true,
      // nodeIntegration: true,
    },
    width: 450,
    height: 550,
  },
  preloadWindow: true,
  showDockIcon: false,
  // showOnAllWorkspaces: false,
  // tray,
  icon: image,
  // icon: image,
});

const menu = new Menu();
menu.append(
  new MenuItem({
    label: "Open",
    submenu: [
      {
        role: "file",
        accelerator:
          process.platform === "darwin" ? "Alt+Cmd+G" : "Alt+Shift+G",
        click: () => {
          mb.showWindow();
        },
      },
    ],
  })
);

// app.whenReady().then(createWindow);

mb.on("ready", () => {
  const { window } = mb;

  Menu.setApplicationMenu(menu);

  app.dock.hide();

  // open devtools
  window.webContents.openDevTools();

  // open in new window
  app.on("web-contents-created", (event, contents) => {
    contents.on("will-navigate", (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      event.preventDefault();
      shell.openExternal(navigationUrl);
    });
  });

  console.log("Menubar app is ready.");
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
