import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import * as path from 'path';
import { DISCORD_API } from './supersecretkeys';

const assetsDirectory = path.join(__dirname, '../assets');

let tray: Tray = undefined;
let window: BrowserWindow = undefined;

app.dock.hide();

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
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      //window.openDevTools({ mode: 'detach' });
    }
  });
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: true,
    transparent: false,
    webPreferences: {
      backgroundThrottling: false
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