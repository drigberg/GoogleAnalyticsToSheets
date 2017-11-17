/*
 * Copyright 2017 Daniel Rigberg - All Rights Reserved
 * https://github.com/drigberg
 */

/**
 * Module dependencies
 */

const path = require('path')
const url = require('url')
const { shell, BrowserWindow, Menu } = require('electron')

/**
 * Module
 */

const startUrl = process.env.ELECTRON_START_URL || url.format({
  pathname: path.join(__dirname, '/../build/index.html'),
  protocol: 'file:',
  slashes: true
});

let mainWindow

function hello() {
  console.log("AAAAHHH!!!!")
}

const menuTemplate = [
  { // this is the dropdown under the app name
    submenu: []
  },
  {
    label: 'View',
    submenu: [
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Readme',
        click () { } // show readme
      }
    ]
  },
  {
    label: 'More',
    submenu: [
      {
        label: 'About the developer',
        click () { shell.openExternal('http://www.danielrigberg.com') }
      }
    ]
  },
]

function createWindow () {
  mainWindow = new BrowserWindow({width: 1200, height: 800})

  mainWindow.loadURL(startUrl)

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

module.exports = {
  createWindow,
  mainWindow
}