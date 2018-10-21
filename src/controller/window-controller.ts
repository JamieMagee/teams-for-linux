import { BrowserWindow, shell } from 'electron';
import path = require('path');
import { readFileSync } from 'fs';
const isDev = require('electron-is-dev');

const teamsUrl = 'https://teams.microsoft.com';

export class WindowController {
  win!: BrowserWindow | null;
  constructor() {
    this.init();
  }

  init() {
    // Create the browser window.
    this.win = new BrowserWindow({
      width: 1024,
      height: 768,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        partition: 'persist:teams'
      }
    });

    if (isDev) {
      this.win.webContents.openDevTools();
    }
    // and load the index.html of the app.
    this.win.loadURL(teamsUrl, {
      // Latest Edge user agent
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134'
    });

    // prevent the app quit, hide the window instead.
    this.win.on('close', e => {
      if (this.win && this.win.isVisible()) {
        e.preventDefault();
        this.win.hide();
      }
    });

    // Emitted when the window is closed.
    this.win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.win = null;
    });

    // insert styles
    this.win.webContents.on('dom-ready', () => {
      this.win.webContents.insertCSS(
        readFileSync(path.join(__dirname, '../css/annoyances.css'), 'utf-8')
      );

      this.win.show();
    });

    // Open the new window in external browser
    this.win.webContents.on('new-window', this.openInBrowser);
  }

  toggleWindow() {
    if (this.win.isFocused()) {
      this.win.hide();
    } else {
      this.win.show();
    }
  }

  openInBrowser(e: Event, url: string) {
    e.preventDefault();
    shell.openExternal(url);
  }
}
