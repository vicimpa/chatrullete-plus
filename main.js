const { app, BrowserWindow } = require('electron')
const { join } = require('path')

let mainWindow = null

const dev = process.argv.indexOf('--dev') != -1

if (process.platform == 'linux') {
  app.disableHardwareAcceleration()
  app.commandLine.appendSwitch("disable-software-rasterizer")
}

function initialize() {
  makeSingleInstance()

  function createWindow() {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      title: 'ChatRoulette',
      height: 840,
      icon: join(__dirname, '/icon.png'),
      webPreferences: {
        webSecurity: false,
        preload: join(__dirname, 'dist/preload.js')
      }
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL('https://videochatru.com/embed/')

    if (dev)
      mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', () => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

function makeSingleInstance() {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

initialize()