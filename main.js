// Modules to control application life and create native browser window
const {
    app,
    BrowserWindow,
    Menu,
    MenuItem,
    ipcMain, shell
} = require("electron");
const path = require("path");
const url = require("url");

// const contextMenu = require('electron-context-menu');
//
// contextMenu({
//     prepend: (defaultActions, params, browserWindow) => [
//
//         {
//             label: 'Rainbow',
//             // Only show it when right-clicking images
//             visible: params.mediaType === 'image'
//
//         },
//         {
//             label: 'Open File Location',
//             // Only show it when right-clicking images
//             // visible: param
// //             click: ()=>{
// //                 shell.showItemInFolder()
//             click: (menuItem, browserWindow, event)=>{
//                 console.log(browserWindow.webContents);
//                 console.log();
//             }
// // }
//         },
//         {
//             label: 'Search Google for “{selection}”',
//             // Only show it when right-clicking text
//             visible: params.selectionText.trim().length > 0,
//             click: (menuItem, browserWindow, event) => {
//                 // console.log(menuItem);
//                 // console.log(browserWindow.id);
//                 // console.log(params.event)
//                 // alert(event);
//                 // shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`);
//             }
//         }
//     ]
// });
//

// (async () => {
//     await app.whenReady();
//     mainWindow = new BrowserWindow();
// })();


// function cw() {
//     /*...*/
//     console.log("ksdfslj");
//     var python = require('child_process').spawn('python', ['./py/main.py']);
//     python.stdout.on('data', function (data) {
//         console.log("data: ", data.toString('utf8'));
//     });
// }
//
// cw();

/******************
 * ***************
 * Python Setup
 */
const {PythonShell} = require('python-shell');


// let options = {
//     mode: 'text',
//     pythonOptions: ['-u'], // get print results in real-time
//     args: [`A:\\!Series`]
// };
//
// PythonShell.run('./py/data.py', options, function (err, results) {
//     if (err) throw err;
//     // results is an array consisting of messages collected during execution
//     console.log('results: %j', results);
//
//     // Load the gui only when the app is loaded
//     app.whenReady().then(createWindow);
//     // contextMenuFunc()
// });


let mainWindow;
let addWindow;

/*
 Main Window Creation
 */

function createWindow() { // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 650,
        title:'Episode Tracker',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        },
    });
    // and load the index.html of the app.
    mainWindow.loadFile("index.html");
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.on("closed", function () {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

}

/*
 Creates addWindow
 */
// function createAddWindow() { // Create the browser window.
//     addWindow = new BrowserWindow({
//         width: 300,
//         height: 200,
//         title: "Add to list",
//         webPreferences: {
//             nodeIntegration: true
//         }
//
//     });
//     // and load the html of the app.
//     addWindow.loadFile("addWindow.html");
//
//     addWindow.on("closed", function () {
//         addWindow = null;
//     });
// }
//

// catch item:add
ipcMain.on('item:add', (e, item) => {
    console.log("sdf " + item);
    mainWindow.webContents.send('item:add', item);
    console.log("sdf " + item);
    addWindow.close();
});

/*
 Menu Bar
 */
const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Add Item",
                click() {
                    createAddWindow();
                },
            },
            {
                label: "Clear Item",
            },
            {
                label: "Quit",
                click() {
                    if (process.platform !== "darwin") {
                        app.quit();
                    }
                },
            },
        ],
    }, {
        label: "Developer Tools",
        submenu: [{
            label: "Toggle DevTools",
            accelerator: process.platform === "darwin" ? "Command+I" : "Ctrl+I",
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            },
        },
            {
                role: "reload",
            }],
    },
];

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);

/**
 *
 * Context Menu
 */

// const ctxMenu = new Menu();
// ctxMenu.append(new MenuItem({
//     label: 'Menu'
// }));
//
// function contextMenuFunc() {
//     app.on('context-menu', (e, param) => {
//         e.preventDefault();
//         ctxMenu.popup(mainWindow, param.x, param.y)
//     });
// }


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.


// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }

});


app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }


});

app.whenReady().then(createWindow);
// console.log($('h1').text())

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
