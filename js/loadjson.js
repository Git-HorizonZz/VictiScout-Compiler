var teamData = {};
// Object that holds all table rows

async function load() {
    // Reference to HTML table
    const TABLE = document.getElementById('tbody');
    // Clear old table
    var tableHeaderRowCount = 1;
    var rowCount = TABLE.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        TABLE.deleteRow(tableHeaderRowCount);
    }
    // Path to the compiled datafile
    let filePath = 'analysis/sorted_data.json'
    try {
        const response = await fetch(filePath);
        const data = await response.json();
        const dataArray = [];
        const keyArray = [];
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                // Adds each json object's data to dataArray
                dataArray.push(data[key]);
                // Adds each json object's titles to keyArray
                keyArray.push(key)
            }
        }
        // Add dataArray to TABLE for parsing via the merge function
        dataArray.forEach((v,i) => {
            v.forEach((_v, _i) => {
                if (keyArray[i].toUpperCase() != 'TEAM') {
                    TABLE.innerHTML +=  `<tr>
                                            <td>${keyArray[i]}</td> 
                                            <td>${_v[0]}</td>
                                            <td>${_v[1]}-${_v[2]}-${_v[3]}</td>
                                            <td>${_v[4]}-${_v[5]}-${_v[6]}</td>
                                            <td>${_v[7]}</td>
                                            <td>${_v[8]}</td>
                                            <td>${_v[9]}-${_v[10]}-${_v[11]}</td>
                                            <td>${_v[12]}-${_v[13]}-${_v[14]}</td>
                                            <td>${_v[16]}</td>
                                        </tr>`;
                }
            });
        });
        
    } catch (err) {
        document.getElementById('complete-message').innerText = `${err}`;
        document.getElementById('pop-backer-complete').classList.remove('hidden');
    }
    merge();
}

function merge() {
    teamData = {}
    // Reference to HTML table
    const TABLE = document.getElementById('tbody');
    for (const child of TABLE.children) {
        let team = child.children[0].innerHTML;
        // If team doesn't have an entry in teamData, this creates it
        if (!teamData[team]) {
            teamData[team] = {
                number: team,
                count: 0,
                conesAuton: [0, 0, 0],
                cubesAuton: [0, 0, 0],
                leaveComm: 0,
                dockAuton: 0,
                conesDriver: [0, 0, 0],
                cubesDriver: [0, 0, 0],
                dockTeleop: 0,
                dropdown: [],
                dropped: false,
            };
        }
        // Increase game count
        teamData[team].count += 1;

        // Autonomous cones
        let coneAuto = child.children[2].innerHTML.split('-');
        coneAuto.forEach((v, i) => { coneAuto[i] = parse(v, true) });
        teamData[team].conesAuton[0] += coneAuto[0];
        teamData[team].conesAuton[1] += coneAuto[1];
        teamData[team].conesAuton[2] += coneAuto[2];

        // Autonomous cubes
        let cubeAuto = child.children[3].innerHTML.split('-');
        cubeAuto.forEach((v, i) => { cubeAuto[i] = parse(v, true) });
        teamData[team].cubesAuton[0] += cubeAuto[0];
        teamData[team].cubesAuton[1] += cubeAuto[1];
        teamData[team].cubesAuton[2] += cubeAuto[2];

        // Robot leaves community in autonomous
        if (child.children[4].innerHTML == 'true') {
            teamData[team].leaveComm += 3;
        }

        // Autonomous Charging
        if (child.children[5].innerHTML == 'D &amp; E') {
            teamData[team].dockAuton += 12;
        } else if (child.children[5].innerHTML == 'D &amp; not E') {
            teamData[team].dockAuton += 8;
        } else if (child.children[5].innerHTML == '') {
            child.children[5].innerHTML = 'none';
        }

        // Teleop Cones
        let coneTele = child.children[6].innerHTML.split('-');
        coneTele.forEach((v, i) => { coneTele[i] = parse(v, true) });
        teamData[team].conesDriver[0] += coneTele[0];
        teamData[team].conesDriver[1] += coneTele[1];
        teamData[team].conesDriver[2] += coneTele[2];

        // Teleop Cubes
        let cubeTele = child.children[7].innerHTML.split('-');
        cubeTele.forEach((v, i) => { cubeTele[i] = parse(v, true) });
        teamData[team].cubesDriver[0] += cubeTele[0];
        teamData[team].cubesDriver[1] += cubeTele[1];
        teamData[team].cubesDriver[2] += cubeTele[2];

        // Teleop Charging
        if (child.children[8].innerHTML == 'D &amp; E') {
            teamData[team].dockTeleop += 10;
        } else if (child.children[8].innerHTML == 'D &amp; not E') {
            teamData[team].dockTeleop += 6;
        } else if (child.children[8].innerHTML == 'parked') {
            teamData[team].dockTeleop += 2;
        } else if (child.children[8].innerHTML == '') {
            child.children[8].innerHTML = 'none';
        }

        // Add individual match to team record
        teamData[team].dropdown.push(`<tr class='T${team}'>
                                          <td onclick="avgRecalc(${team}, this.parentElement)">^</td> 
                                          <td>${child.children[1].innerHTML}</td>
                                          <td name="TOP-MID-LOW">${child.children[2].innerHTML}</td>
                                          <td name="TOP-MID-LOW">${child.children[3].innerHTML}</td>
                                          <td>${child.children[4].innerHTML}</td>
                                          <td>${child.children[5].innerHTML}</td>
                                          <td name="TOP-MID-LOW">${child.children[6].innerHTML}</td>
                                          <td name="TOP-MID-LOW">${child.children[7].innerHTML}</td>
                                          <td>${child.children[8].innerHTML}</td>
                                          <td name="CYCLES">${cubeTele[0]+cubeTele[1]+cubeTele[2]+coneTele[0]+coneTele[1]+coneTele[2]}</td>
                                      </tr>`);
    }
    // Clear old table
    var tableHeaderRowCount = 0;
    var rowCount = TABLE.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        TABLE.deleteRow(tableHeaderRowCount);
    }
    // Calculate averages
    for (const team in teamData) {
        if (team != 'TEAM') {
            let divisor = teamData[team].count;
            teamData[team].conesAuton[0] = (teamData[team].conesAuton[0] / divisor) * 6;
            teamData[team].conesAuton[1] = (teamData[team].conesAuton[1] / divisor) * 4;
            teamData[team].conesAuton[2] = (teamData[team].conesAuton[2] / divisor) * 3;
            teamData[team].cubesAuton[0] = (teamData[team].cubesAuton[0] / divisor) * 6;
            teamData[team].cubesAuton[1] = (teamData[team].cubesAuton[1] / divisor) * 4;
            teamData[team].cubesAuton[2] = (teamData[team].cubesAuton[2] / divisor) * 3;
            teamData[team].leaveComm = (teamData[team].leaveComm / divisor).toFixed(1);
            teamData[team].dockAuton = (teamData[team].dockAuton / divisor).toFixed(1);
            teamData[team].conesDriver[0] = (teamData[team].conesDriver[0] / divisor) * 5;
            teamData[team].conesDriver[1] = (teamData[team].conesDriver[1] / divisor) * 3;
            teamData[team].conesDriver[2] = (teamData[team].conesDriver[2] / divisor) * 2;
            teamData[team].cubesDriver[0] = (teamData[team].cubesDriver[0] / divisor) * 5;
            teamData[team].cubesDriver[1] = (teamData[team].cubesDriver[1] / divisor) * 3;
            teamData[team].cubesDriver[2] = (teamData[team].cubesDriver[2] / divisor) * 2;
            teamData[team].dockTeleop = (teamData[team].dockTeleop / divisor).toFixed(1);
        }
    }
    // Write new tables
    for (const team in teamData) {
        if (team != 'TEAM') {
            let avco_auto = (teamData[team].conesAuton[0]+teamData[team].conesAuton[1]+teamData[team].conesAuton[2]);
            let avcu_auto = (teamData[team].cubesAuton[0]+teamData[team].cubesAuton[1]+teamData[team].cubesAuton[2]);
            let avco_tele = (teamData[team].conesDriver[0]+teamData[team].conesDriver[1]+teamData[team].conesDriver[2]);
            let avcu_tele = (teamData[team].cubesDriver[0]+teamData[team].cubesDriver[1]+teamData[team].cubesDriver[2]);
            let total = (parse(avco_auto)+parse(avco_tele)+parse(avcu_auto)+parse(avcu_tele)+parse(teamData[team].leaveComm)+parse(teamData[team].dockAuton)+parse(teamData[team].dockTeleop));
            TABLE.innerHTML += `<tr class="averaged" id="M${team}" onclick="dropdowntoggle(${team})">
                                    <td>${teamData[team].number}</td> 
                                    <td>${teamData[team].count}</td>
                                    <td>${avco_auto.toFixed(1)}</td>
                                    <td>${avcu_auto.toFixed(1)}</td>
                                    <td>${teamData[team].leaveComm}</td>
                                    <td>${teamData[team].dockAuton}</td>
                                    <td>${avco_tele.toFixed(1)}</td>
                                    <td>${avcu_tele.toFixed(1)}</td>
                                    <td>${teamData[team].dockTeleop}</td>
                                    <td>${total.toFixed(1)}</td>
                                </tr>`;
        }
    }
}

function closeDrops() {
    for (const team in teamData) {
        if (teamData[team].dropped) {
            var toRemove = document.querySelectorAll(`.T${team}`);
            toRemove.forEach((v) => { v.remove() });
            teamData[team].dropped = false;
        }
    }
}

// Toggle team individual matches down/up
function dropdowntoggle(team) {
    if (!teamData[team].dropped) {
        const parent = document.getElementById(`M${team}`);
        teamData[team].dropdown.forEach((v) => { parent.insertAdjacentHTML('afterend', v) });
        teamData[team].dropped = true;
    } else {
        var toRemove = document.querySelectorAll(`.T${team}`);
        toRemove.forEach((v) => { v.remove() });
        teamData[team].dropped = false;
    }
}

// function avgRecalc(team, remove) {
//     const toRecalc = document.getElementById(`M${team}`);
//     var matches = document.querySelectorAll(`.T${team}`);
//     matches.forEach((v) => { if(v != remove) { console.log(v) } });
//     finish later     //
// }

function parse(str) { return parseFloat(str) }

function parse(str, int) { return parseInt(str) }
