"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = __importStar(require("path"));
var os_1 = require("os");
var assetsDirectory = path.join(__dirname, '../assets');
var tray = undefined;
var menu = new electron_1.Menu();
var window = undefined;
if (os_1.platform() === 'darwin')
    electron_1.app.dock.hide(); // on macOS, hide the dock icon.
electron_1.app.on('ready', function () {
    createTray();
    createWindow();
});
// Quit the app when the window is closed
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
var createTray = function () {
    tray = new electron_1.Tray(path.join(assetsDirectory, 'RikkaTray.png'));
    // Decide if we want to use an title for the app or not.
    //tray.setTitle('Chiisai');
    tray.on('right-click', electron_1.app.quit);
    tray.on('double-click', toggleWindow);
    tray.on('click', function (event) {
        toggleWindow();
        // Show devtools when command clicked
        if (window.isVisible() && process.defaultApp && event.metaKey) {
            window.openDevTools({ mode: 'detach' });
        }
    });
};
var getWindowPosition = function () {
    var windowBounds = window.getBounds();
    var trayBounds = tray.getBounds();
    // Center window horizontally below (or above) the tray icon
    var x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
    // Position window 4 pixels vertically below the tray icon (on macOS). For Windows you get this monstrosity calculation.
    var y = os_1.platform() === "win32" ? Math.round((trayBounds.y - trayBounds.height * 15)) : Math.round(trayBounds.y + trayBounds.height + 4);
    return { x: x, y: y };
};
var createWindow = function () {
    window = new electron_1.BrowserWindow({
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
    window.loadURL("file://" + path.join(__dirname, '../index.html'));
    // Hide the window when it loses focus
    window.on('blur', function () {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
        }
    });
};
var toggleWindow = function () {
    if (window.isVisible()) {
        window.hide();
    }
    else {
        showWindow();
    }
};
var showWindow = function () {
    var position = getWindowPosition();
    window.setPosition(position.x, position.y, false);
    window.show();
    window.focus();
};
electron_1.ipcMain.on('show-window', function () {
    showWindow();
});
//# sourceMappingURL=main.js.map