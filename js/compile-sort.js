var fs = require('fs');
var csv = require('csv-parser');

const folderPath = `${__dirname}/scouting-data-files`;
const outputFile = `${__dirname}/analysis/sorted_data.json`;

if (!fs.existsSync(`${__dirname}/analysis`)) { fs.mkdirSync(`${__dirname}/analysis`) }

async function compile() {
    const outputJson = {}
    console.log(fs.readdirSync(folderPath).length)
    if (fs.readdirSync(folderPath).length === 0) {
        document.getElementById('complete-message').innerText = 'no files :(';
        document.getElementById('pop-backer-complete').classList.add('show');
    }
    fs.readdir(folderPath, (err, files) => {
        if (err) { throw err }
        let count = 0; // keep track of number of processed files
        // Iterate over each file in the folder
        files.forEach(file => {
            // Check if the file is a CSV file
            if (file.endsWith('.csv')) {
                const filePath = `${folderPath}/${file}`;

                // Parse the CSV file and add its data to the outputJson array
                fs.createReadStream(filePath).pipe(csv()).on('data', data => {
                    const { team, ...rest } = data;
                    if (!outputJson[team]) {
                        outputJson[team] = [];
                    }
                    outputJson[team].push(Object.values(rest));
                }).on('end', () => {
                    count++;
                    if (count === files.length) {
                        // All files have been processed, write the merged data to the output JSON file
                        fs.writeFile(outputFile, JSON.stringify(outputJson), err => {
                            if (err) { throw err }
                            document.getElementById('pop-backer-complete').classList.add('show');
                            console.log(document.getElementById('pop-backer-complete').className);
                        });
                    }
                });
            }
        });
    });
}