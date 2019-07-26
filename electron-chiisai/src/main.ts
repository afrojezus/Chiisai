import { app, BrowserWindow, ipcMain, Tray, Menu, MenuItem } from 'electron';
import * as path from 'path';
import { DISCORD_API } from './supersecretkeys';
import { platform } from 'os';

const assetsDirectory = path.join(__dirname, '../assets');

let tray: Tray = undefined;
let menu: Menu = new Menu();
let window: BrowserWindow = undefined;

if (platform() === 'darwin') app.dock.hide(); // on macOS, hide the dock icon.

app.on('ready', () => {
  createTray();
  createWindow();
});

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit();
});

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'RikkaTray.png'));
  // Decide if we want to use an title for the app or not.
  //tray.setTitle('Chiisai');
  tray.on('right-click', app.quit);
  tray.on('double-click', toggleWindow);
  tray.on('click', function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
    (window as any).openDevTools({ mode: 'detach' });
    }
  });
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below (or above) the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon (on macOS). For Windows you get this monstrosity calculation.
  const y = platform() === "win32" ? Math.round((trayBounds.y - trayBounds.height * 15)) : Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

const createWindow = () => {
  window = new BrowserWindow({
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
    webPreferences: {
      backgroundThrottling: false,
      enableBlinkFeatures: 'OverlayScrollbars'
    }
  });
  window.loadURL(`file://${path.join(__dirname, '../index.html')}`);

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
};

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
};

ipcMain.on('show-window', () => {
  showWindow();
});
