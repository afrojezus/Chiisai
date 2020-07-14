/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, Tray, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Dotenv from 'dotenv';
import DiscordRPC from 'discord-rpc';
import { platform } from 'os';
import MenuBuilder from './menu';
Dotenv.config();

const assetsDirectory = path.join(__dirname, '../assets');

if (platform() === 'darwin') app.dock.hide();

if (process.env.DISCORD_KEY) DiscordRPC.register(process.env.DISCORD_KEY);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let tray: Tray = undefined;
let mainWindow: BrowserWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'RikkaTray.png'));
  // Decide if we want to use an title for the app or not.
  //tray.setTitle('Chiisai');
  tray.on('right-click', app.quit);
  tray.on('double-click', toggleWindow);
  tray.on('click', function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      (window as any).openDevTools({ mode: 'detach' });
    }
  });
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 350,
    height: 600,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    vibrancy: 'appearance-based',
    alwaysOnTop: true,
    hasShadow: true,
    skipTaskbar: true,
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
            nodeIntegration: true,
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
          },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow.hide();
  });

  // Hide the window when it loses focus
  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below (or above) the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon (on macOS). For Windows you get this monstrosity calculation.
  const y =
    platform() === 'win32'
      ? Math.round(trayBounds.y - trayBounds.height * 20)
      : Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

const showWindow = () => {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.focus();
};

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

/**
 * Add event listeners...
 */

ipcMain.on('show-window', () => {
  showWindow();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  createTray();
  createWindow();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

async function setRPCActivity() {
  if (!rpc || !mainWindow) return;

  const chiisaiData = await mainWindow.webContents.executeJavaScript(
    'window.chiisaiData'
  );

  console.log(chiisaiData);

  if (chiisaiData && chiisaiData.playing)
    await rpc.setActivity({
      details: `Listening to ${chiisaiData.title}`,
      state: 'chiisai-js',
      startTimestamp: Number(new Date()),
      largeImageKey: 'rikka3x',
      largeImageText: 'uwu',
      instance: false,
    });
}

rpc.on('ready', () => {
  setRPCActivity();

  setInterval(() => {
    setRPCActivity();
  }, 15e3);
});

if (process.env.DISCORD_KEY)
  rpc.login({ clientId: process.env.DISCORD_KEY }).catch(console.error);
