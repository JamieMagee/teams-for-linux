import { app } from 'electron';
import { WindowController } from './controller/window-controller';
import { TrayController } from './controller/tray-controller';

class ElectronTeams {
  windowController!: WindowController;
  trayController!: TrayController;

  constructor() {
    this.windowController = null;
    this.trayController = null;
  }

  // init method, the entry point of the app
  init() {
    if (this.isRunning()) {
      app.quit();
    } else {
      this.initApp();
    }
  }

  // check if the app is already running. return true if already launched, otherwise return false.
  isRunning() {
    app.on('second-instance', () => {
      setImmediate(() => app.exit(0));
    });
    return !app.requestSingleInstanceLock();
  }

  // init the main app
  initApp() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', this.createControllers);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      app.quit();
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.windowController === null) {
        this.createControllers();
      } else {
        this.windowController.win.show();
      }
    });
  }

  createControllers() {
    this.windowController = new WindowController();
    this.trayController = new TrayController(this.windowController);
  }
}

new ElectronTeams().init();
