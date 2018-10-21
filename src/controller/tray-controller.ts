import { WindowController } from './window-controller';

import { app, Tray, nativeImage, Menu, ipcMain } from 'electron';
import path = require('path');

export class TrayController {
  windowController: WindowController;
  tray!: Electron.Tray;
  constructor(windowController: WindowController) {
    this.windowController = windowController;
    this.init();
  }

  init() {
    this.tray = new Tray(this.createTrayIcon());

    const context = Menu.buildFromTemplate([
      { label: 'Quit', click: () => this.cleanupAndQuit() }
    ]);

    this.tray.setContextMenu(context);

    this.tray.on('click', () => this.fireClickEvent());

    ipcMain.on('updateUnread', () => {
      this.tray.setImage(this.createTrayIcon());
    });
  }

  createTrayIcon() {
    const iconPath = '../../assets/icon.png';
    return nativeImage.createFromPath(path.join(__dirname, iconPath));
  }

  fireClickEvent() {
    this.windowController.toggleWindow();
  }

  cleanupAndQuit() {
    app.exit(0);
  }
}
