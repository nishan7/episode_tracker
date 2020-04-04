/*
 Import Section
 */
// function include(file) {
//     var script = document.createElement('script');
//     script.src = file;
//     script.type = 'text/javascript';
//     script.defer = true;
//     document.getElementsByTagName('head').item(0).appendChild(script);
// }
//
// include('./scripts/jquery.js');


window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;

const electron = nodeRequire('electron');
window.$ = window.jQuery = nodeRequire('./scripts/jquery');
const {remote} = nodeRequire('electron');
const {Menu, MenuItem} = remote;
const Store = nodeRequire('electron-store');
const {ipcRenderer, shell} = electron;
const data = nodeRequire('./py/file_data.json');
let indexedData = [];


/***
 *
 * Set and get the search box values
 */
const store = new Store();
let loc = store.get('loc');
if (loc != null) {
    console.log(loc);
    $(document).ready(function () {
        // document.getElementById('search-box').textContent = loc;
        $('#search-box').val(loc);
    });
}

function file_location(e) {
    let val = document.getElementById('search-box').value;
    let temp_loc = store.get('loc');

    console.log(temp_loc, val);


    // if (temp_loc !== val) {
    const {PythonShell} = nodeRequire('python-shell');
    let options = {
        mode: 'text',
        // pythonOptions: ['-u'], // get print results in real-time
        args: [val]
    };


    PythonShell.run('./py/data.py', options, function (err, results) {
        console.log('reached here');
        if (err) {
            if (err.message === 'Exception: Incorrect path') {
            }
            alert("Invalid path");
            console.log(err.message);
            remote.getCurrentWebContents().reload();

        } else {
            store.delete('loc');
            store.set('loc', val);
            remote.getCurrentWindow().reload();
        }

        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
    });


    // }


}


/**
 *
 * context menu
 */


function contextMenuDeclaration(args) {
    let menu = new Menu();
    args.forEach((arg) => {
        menu.append(new MenuItem(arg))
    });
    menu.popup({window: remote.getCurrentWindow()})
}


$(document).ready(function () {
    var i = 0;

    /// Populating the cards
    let episodeName;
    for (let k in data) {
        // console.log(k);
        str = data[k][2];
        episodeName = str.substring(str.length - 6, str.length);
        $('#cards').append(cards(k, episodeName, i++));
        indexedData.push(data[k]);
        console.log(indexedData)

        // $('#cards')
    }

    // Setting up hover asthetics
    $(".series-img").hover(function () {
            var parent = this.parentNode;
            $(parent).addClass('hover');
        },
        function () {
            var parent = this.parentNode;
            $(parent).removeClass('hover');
        });

    //Context menu
    $('.series-card').contextmenu(function (e) {
        // alert('context')
        console.log(e);
        context(e);
    })


});

// Dectects right click context menu

function context(e) {

    let id = e.delegateTarget.id;
    let seriesName = e.delegateTarget.firstChild.nextSibling.textContent;
    console.log(id, seriesName);
    // let search = menu.getMenuItemById('search');
    // search.label = `Search ${seriesName} in Google`;
    args = [
        {
            'label': `Open File Location`, 'click': function () {
                shell.showItemInFolder(indexedData[id][0]);
                // remote.BrowserWindow.getFocusedWindow().minimize();
            }
        },
        {
            'label': `Search ${seriesName} in Google`,
            'click': function () {
                shell.openExternal(`https://google.com/search?q=${encodeURIComponent(seriesName)}`);
            }
        },
        {'role': 'cut'},
        {'role': 'copy'},
        {'role': 'paste'},
    ];
    console.log(indexedData[id]);
    contextMenuDeclaration(args);
    // console.log('sent');
    // search.click = function () { shell.openExternal(`https://google.com/search?q=${encodeURIComponent(seriesName)}`); };

}


// Opens the clicked files
function opener(item) {
    // alert(item)
    item = decodeURIComponent(item.parentNode.id);
    console.log(item);
    shell.openItem(indexedData[item][0]);
}

function cards(seriesName, episodeName, id) {
    let cardString = `
    <a >
        <div class="series-card card bg-secondary text-black text-center" id="${id}" >
            <div class="card-header bg-transparent head-label justify-content-center">${seriesName}</div>
            <img class="card-img series-img" src="" alt="" onclick="opener(this)">
            
            <!--        </div>-->
<!--            <div class="card-img-overlay">-->
<!--                <h5 class="card-text"></h5>--
<!--                &lt;!&ndash; <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>&ndash;&gt;-->
<!--                &lt;!&ndash; <a href="#" class="btn btn-primary">Go somewhere</a> &ndash;&gt;-->
<!--            </div>-->
            <div class="card-footer bg-transparent  foot-label ">${episodeName} </div>
        </div>
    </a>
`;
    return cardString;

};





