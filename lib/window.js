/*
 * Copyright 2017 Daniel Rigberg - All Rights Reserved
 * https://github.com/drigberg
 */

/**
 * Module dependencies
 */

const path = require('path')
const url = require('url')
const { BrowserWindow } = require('electron')

/**
 * Module
 */

function createWindow () {
  mainWindow = new BrowserWindow({width: 1200, height: 800})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../src/views/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

module.exports = {
  createWindow
}