'use strict';

const { app, BrowserWindow, ipcMain, IpcMessageEvent, ipcRenderer, globalShortcut } = require('electron');

const path = require('path');

const fs = require('fs');

var open = require("open");

// normalize shortcuts for each os
const normalize = require("electron-shortcut-normalizer")

normalize('Ctrl+A')
// => 'CommandOrControl+A'

normalize('CommandOrControl+Z', process.platform)
// => 'Command+Z' on Mac OS X
// => 'Control+Z' on Windows and Linux

normalize('CmdOrCtrl+a', 'darwin')
// => 'Command+A'

normalize('CmdOrCtrl+a', 'win32')
// => 'Control+A'

// `Option` is unique to Mac OS X, so it's normalized to `Alt`:
normalize('Option+Up')
// => 'Alt+Up'

let win;

var tabFilePath = __dirname.slice(0, -4) + '/app/src/assets/storage/tabs.json';
var filepath = __dirname.slice(0, -4) + '/app/src/assets/storage/buttons.json';// you need to save the filepath when you open the file to update without use the filechooser dialog againg
var settingsFilePath = __dirname.slice(0, -4) + '/app/src/assets/storage/settings.json';// you need to save the filepath when you open the file to update without use the filechooser dialog againg

var openBrowser = "";

function createWindow() {
  // Create the browser window.

  win = new BrowserWindow({
    frame: false,
    backgroundColor: '#ffffff',
    icon: __dirname + '/src/assets/logo2.ico'
  })

  win.loadURL(`file://${__dirname}/dist/index.html`)

  win.setResizable(true)

  //// uncomment below to open the DevTools.
  //win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// ON APP STARTUP -----------------------------------------------------------------------------------

// Create window on electron intialization
app.on('ready', function () {
  createWindow();

  fs.readFile(settingsFilePath, function read(err, data) {
    var settings = JSON.parse(data);
    openBrowser = settings.browser;
  })

  fs.readFile(filepath, function read(err, data) {

    var oldFile = [];

    if (err) {
      throw err;
    }

    oldFile = JSON.parse(data);

    // TODO add logic to open same diff urls with same command
    for (let i = 0; i < oldFile.length; i++) {
      if (oldFile[i].shortcut) {
        globalShortcut.register(oldFile[i].shortcut, () => {
          open(oldFile[i].url, openBrowser);
          for (let j = 0; j < oldFile.length; j++) {
            if (oldFile[j].shortcut === oldFile[i].shortcut &&
              oldFile[j].url !== oldFile[i].url) {
              open(oldFile[j].url, openBrowser);
            }
          }
        });
      }
    }
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
});

// WINDOWS WINDOW FUNCTIONS
ipcMain.on('hide', function () {
  win.close();
});

ipcMain.on('minimize', function () {
  win.minimize();
});

ipcMain.on('maximize', function () {
  win.isMaximized() ? win.unmaximize() : win.maximize();
});

// BUTTON LOGIC ---------------------------------------------------------------------------------------------

// add button
ipcMain.on('add-data', function (event, argument) {
  fs.readFile(filepath, function read(err, data) {

    var oldFile = [];

    oldFile = JSON.parse(data);

    oldFile.push(argument);

    if (err) {
      throw err;
    }

    if (argument.shortcut) {

      globalShortcut.unregister(argument.shortcut);

      var urlList = []
      urlList.push(argument.url);

      for (let j = 0; j < oldFile.length; j++) {
        if (oldFile[j].shortcut === argument.shortcut &&
          oldFile[j].url !== argument.url) {
          urlList.push(oldFile[j].url)
        }
      }

      if (argument.shortcut) {
        globalShortcut.register(argument.shortcut, () => {
          for (let k = 0; k < urlList.length; k++) {
            open(urlList[k], openBrowser);
          }
        });
      }
    }

    oldFile = JSON.stringify(oldFile);

    fs.writeFileSync(filepath, oldFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }

      alert("The file has been succesfully saved");
    });
  });

  fs.readFile(tabFilePath, function read(err, data) {
    var oldTabFile = [];
    oldTabFile = JSON.parse(data);
    if (argument.category === 'All') {
      oldTabFile.all.push(argument.id);
    } else {
      for (let tab of oldTabFile.tabs) {
        if (tab.name === argument.category) {
          if (!tab.order) {
            tab.order = [];
          }
          tab.order.push(argument.id);
          oldTabFile.all.push(argument.id);
        }
      }
    }
    oldTabFile = JSON.stringify(oldTabFile);

    fs.writeFileSync(tabFilePath, oldTabFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
    })
  });
  event.sender.send('add-success', 'success')
});

// update button
ipcMain.on('update-data', function (event, argument) {
  var oldTab;
  var changedCategory = false;

  fs.readFile(filepath, function read(err, data) {

    var oldFile = [];
    if (err) {
      throw err;
    }

    oldFile = JSON.parse(data);
    var oldShortcut;

    // TODO fix update, and adding of first button
    for (let i = 0; i < oldFile.length; i++) {
      if (oldFile[i].id === argument.id) {
        oldShortcut = oldFile[i].shortcut;
      }
    }

    if (argument.shortcut != oldShortcut) {
      // update old shortcut
      if (oldShortcut && oldShortcut != null && oldShortcut != '') {
        if (globalShortcut.isRegistered(oldShortcut)) {
          globalShortcut.unregister(oldShortcut);
          var urlList = []
          for (let j = 0; j < oldFile.length; j++) {
            if (oldFile[j].shortcut === oldShortcut &&
              oldFile[j].url !== argument.url) {
              urlList.push(oldFile[j].url)
            }
          }

          globalShortcut.register(oldShortcut, () => {
            for (let k = 0; k < urlList.length; k++) {
              open(urlList[k], openBrowser);
            }
          });
        }
      }
      if (argument.shortcut != null && argument.shortcut != '') {
        // todo create shared method
        if (globalShortcut.isRegistered(argument.shortcut)) {
          globalShortcut.unregister(argument.shortcut);
          var urlList = []
          for (let j = 0; j < oldFile.length; j++) {
            if (oldFile[j].shortcut === argument.shortcut &&
              oldFile[j].url !== argument.url &&
              oldFile[j].id !== argument.id) {
              urlList.push(oldFile[j].url)
            }
          }

          urlList.push(argument.url);

          globalShortcut.register(argument.shortcut, () => {
            for (let k = 0; k < urlList.length; k++) {
              open(urlList[k], openBrowser);
            }
          });
        } else {
          globalShortcut.register(argument.shortcut, () => {
            open(argument.url, openBrowser);
          });
        }
      }
    }

    for (let button of oldFile) {
      if (button.id === argument.id) {
        if (button.category !== argument.category) {
          oldTab = button.category;
          changedCategory = true;
        }

        button.id = argument.id;
        button.url = argument.url;
        button.shortcut = argument.shortcut;
        button.category = argument.category;
        button.color = argument.color
      }
    }

    oldFile = JSON.stringify(oldFile);

    fs.writeFileSync(filepath, oldFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
      alert("The file has been succesfully saved");
    });

    // tab order management
    if (changedCategory) {
      fs.readFile(tabFilePath, function read(err, data) {
        var oldTabFile = [];
        oldTabFile = JSON.parse(data);
        for (let i = 0; i < oldTabFile.tabs.length; i++) {
          if (oldTab === oldTabFile.tabs[i].name) {
            oldTabFile.tabs[i].order = oldTabFile.tabs[i].order.filter((value) => {
              return argument.id === value ? false : true;
            });
          }
          if (argument.category === oldTabFile.tabs[i].name) {
            oldTabFile.tabs[i].order.push(argument.id);
          }
        }
        oldTabFile = JSON.stringify(oldTabFile);

        fs.writeFileSync(tabFilePath, oldTabFile, (err) => {
          if (err) {
            console.log("An error ocurred updating the file" + err.message);
            console.log(err);
            return;
          }
        })
      });
    }
  });
});

// Delete Button
ipcMain.on('delete-data', function (event, argument) {
  fs.readFile(filepath, function read(err, data) {

    var oldFile = [];

    if (err) {
      throw err;
    }

    oldFile = JSON.parse(data);

    oldFile = oldFile.filter(button => {
      return argument.id === button.id ? false : true;
    });

    if (argument.shortcut) {
      // todo create shared method
      if (globalShortcut.isRegistered(argument.shortcut)) {
        globalShortcut.unregister(argument.shortcut);
        var urlList = []
        for (let j = 0; j < oldFile.length; j++) {
          if (oldFile[j].shortcut === argument.shortcut &&
            oldFile[j].url !== argument.url) {
            urlList.push(oldFile[j].url)
          }
        }

        globalShortcut.register(argument.shortcut, () => {
          for (let k = 0; k < urlList.length; k++) {
            open(urlList[k], openBrowser);
          }
        });
      }
    }

    oldFile = JSON.stringify(oldFile);

    fs.writeFileSync(filepath, oldFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }

      alert("The file has been succesfully saved");
    });
  });

  fs.readFile(tabFilePath, function read(err, data) {
    var oldTabFile = [];
    oldTabFile = JSON.parse(data);

    if (argument.category === 'All') {
      oldTabFile.all = oldTabFile.all.filter(id => {
        return argument.id === id ? false : true;
      });
    } else {
      for (let i = 0; i < oldTabFile.tabs.length; i++) {
        if (oldTabFile.tabs[i].name === argument.category) {
          oldTabFile.tabs[i].order = oldTabFile.tabs[i].order.filter(id => {
            return argument.id === id ? false : true;
          });
          oldTabFile.all = oldTabFile.all.filter(id => {
            return argument.id === id ? false : true;
          });
        }
      }
    }
    oldTabFile = JSON.stringify(oldTabFile);

    fs.writeFileSync(tabFilePath, oldTabFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }
    })
  });
});

// Swap button order
ipcMain.on('swap', function (event, argument) {
  fs.readFile(tabFilePath, function read(err, data) {

    var oldFile = [];

    if (err) {
      throw err;
    }

    oldFile = JSON.parse(data);

    if (argument.tab === 'All') {
      oldFile.all = argument.newList;
    } else {
      for (let tab of oldFile.tabs) {
        if (tab.name === argument.tab) {
          tab.order = argument.newList;
        }
      }
    }

    oldFile = JSON.stringify(oldFile);

    fs.writeFileSync(tabFilePath, oldFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }

      alert("The file has been succesfully saved");
    });
  });
});

// TAB LOGIC ---------------------------------------------------------------------------------------------

// Add tab
ipcMain.on('tabs-data', function (event, argument) {

  fs.readFile(tabFilePath, function read(err, data) {

    var oldFile = [];

    if (err) {
      throw err;
    }

    oldFile = JSON.parse(data);

    oldFile.tabs.push(argument);

    oldFile = JSON.stringify(oldFile);

    fs.writeFileSync(tabFilePath, oldFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }

      alert("The file has been succesfully saved");
    });
  });
});

// Delete Tab
ipcMain.on('tabs-delete', function (event, argument) {
  fs.readFile(tabFilePath, function read(err, data) {

    var oldFile = [];

    if (err) {
      throw err;
    }

    oldFile = JSON.parse(data);

    oldFile.tabs = oldFile.tabs.filter(tab => {
      return argument.name === tab.name ? false : true;
    });

    oldFile = JSON.stringify(oldFile);

    fs.writeFileSync(tabFilePath, oldFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }

      alert("The file has been succesfully saved");
    });
  });

  fs.readFile(filepath, function read(err, data) {

    var oldFile = JSON.parse(data);

    for (let i = 0; i < oldFile.length; i++) {
      if (oldFile[i].category === argument.name) {
        oldFile[i].category = 'All';
      }
    }

    oldFile = JSON.stringify(oldFile);

    fs.writeFileSync(filepath, oldFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }

      alert("The file has been succesfully saved");
    });
  });
});

// Swap tab order
ipcMain.on('swapTabs', function (event, argument) {
  fs.readFile(tabFilePath, function read(err, data) {

    const oldFile = JSON.parse(data);

    const tabFile = {
      all: oldFile.all,
      tabs: argument
    }
    const newOrder = JSON.stringify(tabFile);

    fs.writeFileSync(tabFilePath, newOrder, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }

      alert("The file has been succesfully saved");
    });
  });
});

// SETTINGS LOGIC ------------------------------------------------------------------

// update settings
ipcMain.on('update-settings', function (event, argument) {
  fs.readFile(settingsFilePath, function read(err, data) {

    var oldFile;

    if (err) {
      throw err;
    }

    oldFile = JSON.parse(data);
    oldFile.theme = argument.theme;
    oldFile.buttonSize = argument.buttonSize;
    oldFile.browser = argument.browser;
    oldFile = JSON.stringify(oldFile)

    fs.writeFileSync(settingsFilePath, oldFile, (err) => {
      if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
      }

      alert("The file has been succesfully saved");
    });
  });
});