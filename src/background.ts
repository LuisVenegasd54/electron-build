'use strict'

import { app, protocol, BrowserWindow  } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
// const { autoUpdater } =  require("update-electron-app")
import { autoUpdater } from "electron-updater";


let win:BrowserWindow



// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !(process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    }
  })


  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e:any) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow();
  if (!isDevelopment){
    // const server = 'https://update.electronjs.org';
    // const feed:Electron.FeedURLOptions = {url:`https://github.com/LuisVenegasd54/electron-build/tree/electron-update/${app.getVersion()}`};
    // autoUpdater.setFeedURL(feed);
    autoUpdater.checkForUpdates();
    // console.log("version de la app :: ",app.getVersion())
  }
})
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// autoUpdater.on("update-downloaded", (info:any) => {
//   win.webContents.send("update downloaded")
// })

// /*checking for updates*/
// autoUpdater.on("checking-for-update", () => {
//   //your code
//  console.log("hay actualizaciones")
// });

// /*No updates available*/
// autoUpdater.on("update-not-available", (info:any) => {
//   win.webContents.send("update-not-available")
//   //your code
// });

// /*New Update Available*/
// autoUpdater.on("update-available", (info:any) => {
//   //your code
//   win.webContents.send("update available")
//   autoUpdater.downloaded();
// });

// /*Download Status Report*/
// autoUpdater.on("download-progress", (progressObj:any) => {
//  //your code
//  win.webContents.send("download-progress")

// });

// /*Download Completion Message*/
// autoUpdater.on("update-downloaded", (info:any) => {
//  //your code

//  win.webContents.send("update-download")

// });

const server = 'https://github.com/LuisVenegasd54/electron-build/releases/tag'
const feed = `${server}/${app.getVersion()}`

console.log("Proceso ::",feed)

autoUpdater.setFeedURL(feed);

/*checking for updates*/
autoUpdater.on("checking-for-update", () => {
  //your code
  console.log("Holaaa")
});

/*No updates available*/
autoUpdater.on("update-not-available", info => {
  //your code
  console.log("Holaaa")

});

/*New Update Available*/
autoUpdater.on("update-available", info => {
  //your code
  console.log("Holaaa")

});

/*Download Status Report*/
autoUpdater.on("download-progress", progressObj => {
 //your code
 console.log("Holaaa")

});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", info => {
 //your code
});

/*Checking updates just after app launch and also notify for the same*/
app.on("ready", function() {
 autoUpdater.checkForUpdatesAndNotify();
});

setInterval(() => {
  autoUpdater.checkForUpdates()
}, 1000)
