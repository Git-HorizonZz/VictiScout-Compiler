var { shell } = require('electron');
var fs = require('fs');
var path = require('path');
var _folderPath = `${__dirname}/scouting-data-files`;

var cooldown = false;

function react(pressed) { _react(pressed) }

function _react(pressed) {
    if (pressed == 'fil') {
        document.getElementById('pop-backer').classList.remove('hidden');
    } else if (pressed == 'ycl') {
        emptyFolder();
        moveFiles();
    } else if (pressed == 'ncl') {
        moveFiles();
    } else if (pressed == 'com') {
        compile();
    } else if (pressed == 'loa') {
        load();
    } else if (pressed == 'dir') {
        shell.openPath(`${__dirname}`)
    } else if (pressed == 'sdf') {
        shell.openPath(`${__dirname}/scouting-data-files`)
    } else if (pressed == 'pop-backer') {
        document.getElementById(pressed).classList.add('hidden');
    }
}

function moveFiles() {
    const fileInput = document.getElementById('fil');
    const files = fileInput.files;
    // loop through files from input, and send them to be copied
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = file.path;
        moveFileToFolder(filePath);
    }
    // clear files
    fileInput.value = '';
}

function moveFileToFolder(filePath) {
    const fileName = path.basename(filePath);
    var newFileName = fileName;
    // create new file path
    var newFilePath = path.join(_folderPath, newFileName);

    // check if file name is used by another file
    while (fs.existsSync(newFilePath)) {
        // if so, change file name
        newFileName = fileName.substring(0,newFileName.length-5) + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0') + '.csv';
        newFilePath = path.join(_folderPath, newFileName);
    }

    fs.copyFileSync(filePath, newFilePath);
}

function emptyFolder() {
    const _files = fs.readdirSync(_folderPath);

    // Loop through each file/folder and delete it
    for (const file of _files) {
        const _filePath = `${_folderPath}/${file}`;
        if (fs.lstatSync(_filePath).isDirectory()) {
            // If it's a directory, recursively delete its contents
            deleteFolderContents(_filePath);
            fs.rmdirSync(_filePath);
        } else {
            // If it's a file, delete it
            fs.unlinkSync(_filePath);
        }
    }
}


