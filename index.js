const { menubar } = require("menubar");

const path = require("path");
const { app, nativeImage, shell } = require("electron");

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
  // tray,
  icon: image,
  // icon: image,
});

mb.on("ready", () => {
  const { window } = mb;

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
// });

// const createWindow = () => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//     },
//   });

//   mainWindow.loadURL("https://chat.openai.com/chat");

// };

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
// \
