/*
 * Copyright 2017 Daniel Rigberg - All Rights Reserved
 * https://github.com/drigberg
 */

/**
 * Module dependencies
 */
const { app } = require('electron')
const { createWindow } = require('./lib/window')

/**
 * Module
 */

let mainWindow

app.setName('Google Analytics 2 Sheets');

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
