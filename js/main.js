const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 650,
		icon: __dirname + '../images/logo/logo.png',
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/../index.html`);

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference window object
		mainWindow = null;
	});
}

// Called when Electron has finished initialization.
app.on('ready', createWindow);