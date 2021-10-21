var markedWinners = 0; //Anzahl markierter Gewinner
var markedDist = false; //Geber gesetzt ?
var marking = [0, 0, 0, 0, 0, 0] //Speicher für Markierungen


//TODO nur das Pflichtsolo jedes Spielers in Tabelle aufnehmen

function running() {
    var running = localStorage.getItem("running");
    if (running == 1) {
        showResult();
        document.getElementById("round").innerHTML = "Spiel " + localStorage.getItem("round");
    } else {
        localStorage.setItem("running", "1");
    }
    return;
}

function endGame() {
    var round = localStorage.getItem("round") - 1;
    var players = localStorage.getItem("playerNo");
    if (Math.round(round / players) * players == round) {
        document.getElementById("warning").style.display = "none";
    }
    document.getElementById("quit").style.display = "block";
    return;
}

function quit(arg) {
    document.getElementById("quit").style.display = "none";
    if (arg) {
        var boxes = document.getElementsByClassName("Box");
        for (var i = 0; i < 6; i++) document.getElementById(i).style.display = "none";
        document.getElementById("scr").style.display = "none";
        document.getElementById("end").style.display = "none";
        document.getElementById("undo").style.display = "none";
        document.getElementById("clickTbl").style.display = "none";
        document.getElementById("tutorialText").style.display = "none";
        document.getElementById("tutorialText2").style.display = "none";
        document.getElementById("pointTxt1").style.display = "none";
        document.getElementById("pointTxt2").style.display = "none";
        var string = "Ergebnis nach " + (localStorage.getItem("round") - 1) + " Spielen";
        document.getElementById("round").innerHTML = string;
        $("body").append('<a class="fw Box" onclick="createCSV()">CSV erstellen</a>');
        $("body").append('<a class="fw Box" href="../index.html">Hauptmenü</a>');
        localStorage.setItem("running", 0);
    }
    return;
}

function style() { //sorgt dafür, dass immer die richtige Anzahl an Spielerfeldern erscheint und diese ansprechend formatiert sind
    var players = localStorage.getItem("playerNo");
    if (players == 5) { //wenn 5 Spieler, blende Feld 6 aus und setze die Breite von Feld 5 von halbe auf volle Breite
        feld5 = document.getElementById("4");
        feld6 = document.getElementById("5");
        feld6.style.display = "none";
        feld5.classList.remove("hw");
        feld5.classList.add("fw");
        //document.getElementById("tbl5").style.display = "none";

    } else if (players == 4) { //wenn 4 Spieler, blende Felder 5 und 6 aus
        feld5 = document.getElementById("4");
        feld6 = document.getElementById("5");
        feld5.style.display = "none";
        feld6.style.display = "none";
        //document.getElementById("tbl4").style.display = "none";
        //document.getElementById("tbl5").style.display = "none";
        document.getElementById("tutorialText").style.display = "none";

    }

    document.getElementById("scr").disabled = true;
    resetMarking();
    return;

}

function mark(button) { //sorgt fuer korrekte Markierung der Spieler bei Punkteauswahl
    var buttonID = Number(button.id); // TODO ID Abfragen

    var allowedWinners = localStorage.getItem("allowedWinners");
    var allowedDist = localStorage.getItem("allowedDist");

    if (marking[buttonID] == 0) { //wenn normal, mache zu Gewinner, wenn max. Anzahl erreicht, mache zu Geber
        if (markedWinners + 1 <= allowedWinners) {
            marking[buttonID] = 1;
            markedWinners++;
        } else if (markedWinners == allowedWinners && !markedDist && allowedDist == 1) {
            marking[buttonID] = 2;
            markedDist = true;
        }
    } else if (marking[buttonID] == 1) { //wenn Gewinner, mache zu Geber oder zu normal
        if (!markedDist && allowedDist == 1) {
            marking[buttonID] = 2;
            markedWinners--;
            markedDist = true;
        } else {
            marking[buttonID] = 0;
            markedWinners--;
        }
    } else if (marking[buttonID] == 2) { //wenn Geber, mache zu normal
        marking[buttonID] = 0;
        markedDist = false;
    }
    if (markedWinners > 0) { //wenn kein Gewinner ausgewählt, blende Punktevergabe aus
        if ((markedDist && allowedDist == 1) || (!markedDist && allowedDist == 0)) {
            document.getElementById("scr").disabled = false;
        } else {
            document.getElementById("scr").disabled = true;
        }
    } else {
        document.getElementById("scr").disabled = true;
    }
    updateButtonStylePlayer(button.id, marking[buttonID]);
    return;

}

function updateButtonStylePlayer(buttonID, state) { //aktualisiert Farbe und Text der Spielerfelder
    var button = document.getElementById(buttonID);
    var namen = localStorage.getItem("namen").split(",")[buttonID];
    var color;
    var text = button.innerHTML;
    switch (state) {
        case 0:
            color = "orange";
            text = "";
            break;
        case 1:
            color = "yellow";
            text = "(Sieger)";
            break;
        case 2:
            color = "lightblue";
            text = "(Geber)";
            break;
        default:
            throw new IllegalArgumentException();
    }
    button.style.background = color;
    button.innerHTML = namen + " \n " + text;
    //if (wins != 0) {
    setScore(-1);
    wins = 0;
    //}
    return;
}


function resetMarking() { //Setzt Markierungen zurück
    marking = [0, 0, 0, 0, 0, 0];
    markedWinners = 0;
    markedDist = false;
    for (var i = 0; i < 6; i++) {
        updateButtonStylePlayer(i, 0);
    }
    return;
}


var Pscore = 0;
var Mscore = 0;
var wins = 0;

function setScore(value) { //aktualisiert bei Klick auf ein Punktefeld die angezeigte Zahl und die Variable
    Pscore = 0;
    Mscore = 0;
    wins = 0;
    var allowedWinners = localStorage.getItem("allowedWinners");
    var allowedDist = localStorage.getItem("allowdDist");
    var gewNamen = "";
    var verNamen = "";
    var namen = localStorage.getItem("namen").split(",");
    var number = Number(localStorage.getItem("playerNo"));
    var geber = (number == 5) ? 1 : 0;

    for (var i = 0; i < number; i++) { //alle Spieler auf Status 1 werden als Gewinner herausgesucht
        if (marking[i] == 1) {
            gewNamen = gewNamen + " " + namen[i];
            wins++;
        } else if (marking[i] == 0) {
            verNamen = verNamen + " " + namen[i];
        }
    }

    if (wins == 1) { //SOLO gewonnen
        Pscore = value;
        Mscore = value / (number - wins - geber);
    } else if (wins == (number - geber - 1)) { //&& (number == 4 || number == 5)) { //SOLO verloren bei 4 oder 5 Spielern
        Pscore = value;
        Mscore = value * wins;
    } else {
        Pscore = value;
        Mscore = value * wins / (number - wins - geber);
    }
    if (Pscore * wins - Mscore * (number - wins - geber) != 0) alert("PUNKTEFEHLER");
    if (Pscore == pScoreSave) {
        Pscore = 0;
        Mscore = 0;
        value = -1;
    }
    pScoreSave = Pscore;
    mScoreSave = Mscore;

    setButtonStyleScore(value);
    if (value == -1) {
        document.getElementById("winTxt").innerHTML = "";
        document.getElementById("verTxt").innerHTML = "";
        document.getElementById("PpointTxt").innerHTML = 0;
        document.getElementById("MpointTxt").innerHTML = 0;
        document.getElementById("scr").disabled = true;
    } else {
        document.getElementById("winTxt").innerHTML = gewNamen;
        document.getElementById("verTxt").innerHTML = verNamen;
        document.getElementById("PpointTxt").innerHTML = Pscore;
        document.getElementById("MpointTxt").innerHTML = Mscore;
        document.getElementById("scr").disabled = false;
    }

    return;
}


function resetButtonStyleScore() {
    /*
    if(wins == 1){
        disableImpossibleScores();
        return;
    }
    */
    for (var i = 0; i < 20; i++) {
        document.getElementById("sc" + i).style.background = "orange";
        document.getElementById("sc" + i).style.pointerEvents = 'auto';
    }
    return;
}

function setButtonStyleScore(id) {
    resetButtonStyleScore();
    if (id != -1) document.getElementById("sc" + id).style.background = "lightblue";
    return;
}

var pScoreSave = 0;
var mScoreSave = 0;


function closeScore() { //Schließt die Punkteauswahl und übernimmt die Punkte

    if (Pscore <= 0) return;

    var modal = document.getElementById("scoreSelect");
    var punkte = localStorage.getItem("punkte").split(",");
    var number = localStorage.getItem("playerNo");
    var gameTable = JSON.parse(localStorage.getItem("gameTable"));
    var soloTable = JSON.parse(localStorage.getItem("soloTable"));
    var hatSolo = JSON.parse(localStorage.getItem("hatSolo"));
    var verlauf = JSON.parse(localStorage.getItem("verlauf"));
    var cntGewinner = 0;

    for (var i = 0; i < number; i++) { //allen Spieler auf Status 1 werden Punkte gegeben
        if (marking[i] == 1) { //GEWINNER
            punkte[i] = parseInt(punkte[i]) + Pscore;
            cntGewinner++;
        } else if (marking[i] == 0) { //VERLIERER
            punkte[i] = parseInt(punkte[i]) - Mscore;
        } else {
            alert("Fehler bei der Punktvergabe: Ungültiger Statuswert!");
        }
    }


    if ((cntGewinner == 1 || cntGewinner == 3) && hatSolo[number] == 0) { //SOLO
        console.log("SoloTable füllen");
        var solo = (cntGewinner == 1) ? marking.indexOf(1) : marking.indexOf(0);
        if (solo == -1) {
            alert("error while computing solo!");
            return;
        }
        if (hatSolo[solo] == 0) {
            hatSolo[solo] = 1;
            for (var i = 0; i < number; i++) {
                if (marking[i] == 1) { //GEWINNER
                    soloTable[i].push(Pscore);
                    verlauf[i].push(Pscore);
                } else if (marking[i] == 0) { //VERLIERER
                    soloTable[i].push((-1) * Mscore);
                    verlauf[i].push((-1) * Mscore);
                } else if (marking[i] == 2) { //GEBER
                    soloTable[i].push('G'); //TODO oder lieber 0, also den Wert von vorher?
                    verlauf[i].push(0);
                } else {
                    alert("Fehler bei der Punktvergabe: Ungültiger Statuswert!");
                }
            }
            verlauf[number].push('s');
            soloTable[number].push(localStorage.getItem("round"));
        } else {
            console.log("Doch GameTable füllen");
            for (var i = 0; i < number; i++) { //allen Spieler auf Status 1 werden Punkte gegeben
                if (marking[i] == 1) { //GEWINNER
                    gameTable[i].push(punkte[i]);
                    verlauf[i].push(Pscore);
                } else if (marking[i] == 0) { //VERLIERER
                    gameTable[i].push(punkte[i]);
                    verlauf[i].push((-1) * Mscore);
                } else if (marking[i] == 2) { //GEBER
                    gameTable[i].push('G'); //TODO oder lieber 0, also den Wert von vorher?
                    verlauf[i].push(0);
                } else {
                    alert("Fehler bei der Punktvergabe: Ungültiger Statuswert!");
                }
            }
            verlauf[number].push('g');
            gameTable[number].push(Pscore);
        }

    } else {
        console.log("GameTable füllen");
        for (var i = 0; i < number; i++) { //allen Spieler auf Status 1 werden Punkte gegeben
            if (marking[i] == 1) { //GEWINNER
                gameTable[i].push(punkte[i]);
                verlauf[i].push(Pscore);
            } else if (marking[i] == 0) { //VERLIERER
                gameTable[i].push(punkte[i]);
                verlauf[i].push((-1) * Mscore);
            } else if (marking[i] == 2) { //GEBER
                gameTable[i].push('G'); //TODO oder lieber 0, also den Wert von vorher?
                verlauf[i].push(0);
            } else {
                alert("Fehler bei der Punktvergabe: Ungültiger Statuswert!");
            }
        }
        verlauf[number].push('g');
        gameTable[number].push(Pscore);
    }

    console.log("Verlauf: " + verlauf);
    localStorage.setItem("punkte", punkte.toString())
    localStorage.setItem("gameTable", JSON.stringify(gameTable));
    localStorage.setItem("soloTable", JSON.stringify(soloTable));
    localStorage.setItem("hatSolo", JSON.stringify(hatSolo));
    localStorage.setItem("verlauf", JSON.stringify(verlauf));

    Pscore = 0;
    Mscore = 0;
    wins = 0;

    nextRound();
    return;
}

styled = false;

function nextRound() {
    resetMarking();
    resetButtonStyleScore();
    var round = localStorage.getItem("round");
    document.getElementById("round").innerHTML = "Spiel " + ++round;
    localStorage.setItem("round", round);
    document.getElementById("scr").disabled = true;
    emptyTable();
    showResult();
    setScore(-1);
    wins = 0;
    return;
}

function undo() {
    resetMarking();
    resetButtonStyleScore();
    var round = localStorage.getItem("round");
    var number = Number(localStorage.getItem("playerNo"));

    if (round <= 2) {
        localStorage.setItem("round", "1");
        document.getElementById("round").innerHTML = "Spiel 1"
        punkte = [0, 0, 0, 0, 0, 0];
        localStorage.setItem("punkte", punkte.toString());
        gameTable = [
            [],
            [],
            [],
            [],
            [],
            []
        ]; //jeweils 5 Felder für das laufend aktualisierte Ergebnis und ein Feld für die absoluten Punkte in dieser Runde
        soloTable = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        hatSolo = [0, 0, 0, 0, 0]; //Markierung für das Pflichtsolo
        verlauf = [
            [],
            [],
            [],
            [],
            [],
            []
        ]; // 5 Felder für das absolute Ergebnis pro Spieler pro Runde und ein Feld für Tabelle, in die eingetragen wurde // s = Solo, g = Game
        localStorage.setItem("gameTable", JSON.stringify(gameTable));
        localStorage.setItem("soloTable", JSON.stringify(soloTable));
        localStorage.setItem("hatSolo", JSON.stringify(hatSolo));
        localStorage.setItem("verlauf", JSON.stringify(verlauf));

        emptyTable();
        setScore(-1);
        return;
    }

    document.getElementById("round").innerHTML = "Spiel " + --round;
    localStorage.setItem("round", round);
    document.getElementById("scr").disabled = true;
    emptyTable();
    var punkte = localStorage.getItem("punkte").split(",");
    var verlauf = JSON.parse(localStorage.getItem("verlauf"));
    var type = verlauf[number][verlauf[number].length - 1];
    console.log("Verlauf " + verlauf);
    console.log("Type " + type);

    if (type == 's') {
        console.log("removing solo");
        var hatSolo = JSON.parse(localStorage.getItem("hatSolo"));
        var soloTable = JSON.parse(localStorage.getItem("soloTable"));
        var maxIdx = 0;
        var maxVal = 0;
        for (var i = 0; i < soloTable.length; i++) {
            var curVal = Math.abs(soloTable[i].pop());
            if (curVal > maxVal) {
                maxVal = curVal;
                maxIdx = i;
            }
            punkte[i] -= verlauf[i].pop();
        }
        hatSolo[maxIdx] = 0;
        localStorage.setItem("soloTable", JSON.stringify(soloTable));
        localStorage.setItem("hatSolo", JSON.stringify(hatSolo));
    } else {
        console.log("removing game");
        var gameTable = JSON.parse(localStorage.getItem("gameTable"));
        for (var i = 0; i < gameTable.length; i++) {
            gameTable[i].pop();
            punkte[i] -= verlauf[i].pop();
        }
        localStorage.setItem("gameTable", JSON.stringify(gameTable));
    }

    /*
    if (verlauf[0].length > 0) {
        for (var i = 0; i < number; i++) {
            punkte[i] = gameTable[i][gameTable[i].length - 1];
            for (var j = 0; j < soloTable[0].length; j++) {
                punkte[i] += soloTable[i][j]
            }
        }
    }
    else {
        punkte = [0, 0, 0, 0, 0, 0];
    }*/

    localStorage.setItem("punkte", punkte.toString())
    localStorage.setItem("verlauf", JSON.stringify(verlauf));
    showResult();
    setScore(-1);
    wins = 0;
    return;
}

function showResult() {
    var namen = localStorage.getItem("namen").split(",");
    var punkte = localStorage.getItem("punkte").split(",");
    var number = Number(localStorage.getItem("playerNo"));
    var gameTable = JSON.parse(localStorage.getItem("gameTable"));
    var soloTable = JSON.parse(localStorage.getItem("soloTable"));
    var round = localStorage.getItem("round") - 1;


    //Spiel-Tabelle
    var row = "<thead>\n<tr>";
    row += "\n<th scope='col'>Nr.</th>";
    row += "\n<th scope='col'>P</th>";
    for (var i = 0; i < number; i++) {
        row += "\n<th scope='col'>" + namen[i] + "</th>";
    }
    row += "\n</thead>\n</tr>";
    $("#queryTableGames").append(row);

    $("#queryTableGames").append("<tbody>");

    for (var j = 0; j < gameTable[0].length; j++) {
        row = "<tr>";
        row += "<th scope='row'>" + (j + 1) + "</th>";
        row += "<td>" + gameTable[number][j] + "</td>";

        for (var i = 0; i < number; i++) {
            var val = gameTable[i][j];
            if (val == null) val = "";
            row += "\n<td>" + val + "</td>";
        }
        row += "</tr>"
        $("#queryTableGames").append(row);
    }

    $("#queryTableGames").append("</tbody>");

    //SOLO-Tabelle
    if (soloTable[0].length > 0) {
        row = "<thead>\n<tr>";
        row += "\n<th scope='col'>Nr.</th>";
        row += "\n<th scope='col'>R</th>";
        for (var i = 0; i < number; i++) {
            row += "\n<th scope='col'>" + namen[i] + "</th>";
        }
        row += "\n</thead>\n</tr>";
        $("#queryTableSolo").append(row);

        $("#queryTableSolo").append("<tbody>");
        for (var j = 0; j < soloTable[0].length; j++) {
            row = "<tr>";
            row += "<th scope='row'>S" + (j + 1) + "</th>";
            row += "<td>" + soloTable[number][j] + "</td>";

            for (var i = 0; i < number; i++) {
                var val = soloTable[i][j];
                if (val == null) val = "";
                row += "\n<td>" + val + "</td>";
            }
            row += "</tr>"
            $("#queryTableSolo").append(row);
        }
        $("#queryTableSolo").append("</tbody>");
    }

    //ERGEBNIS
    row = "<thead>\n<tr>";
    for (var i = 0; i < number; i++) {
        row += "\n<th scope='col'>" + namen[i] + "</th>";
    }
    row += "\n</thead>\n</tr>";
    $("#queryTableResult").append(row);

    $("#queryTableResult").append("<tbody>");

    row = "<tr>";
    for (var i = 0; i < number; i++) {
        row += "\n<th>" + punkte[i] + "</th>";
    }
    row += "</tr>";
    $("#queryTableResult").append(row);

    $("#queryTableResult").append("</tbody>");

    return;
}


function emptyTable() {
    //document.getElementById("table").style.display = "none";
    $("#queryTableGames").empty();
    $("#queryTableSolo").empty();
    $("#queryTableResult").empty();
    return;
}

function createCSV() {

    var permissions = cordova.plugins.permissions;
    permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

}



// Checking for permissions
function checkPermissionCallback(status) {
    console.log('checking permissions')
    console.log(status)
    if (!status.hasPermission) {
        var errorCallback = function () {
            console.warn('Storage permission is not turned on')
        }
        // Asking permission to the user
        permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function (status) {
                if (!status.hasPermission) {
                    errorCallback()
                } else {
                    // proceed with downloading
                    downloadFile()
                }
            },
            errorCallback)
    } else {
        downloadFile()
    }
}

function downloadFile() {
    var namen = localStorage.getItem("namen").split(",");
    var punkte = localStorage.getItem("punkte").split(",");
    var number = Number(localStorage.getItem("playerNo"));
    var gameTable = JSON.parse(localStorage.getItem("gameTable"));
    var soloTable = JSON.parse(localStorage.getItem("soloTable"));
    var round = localStorage.getItem("round") - 1;

    var result = "";

    result += namen[0];
    for (var i = 1; i < number; i++) {
        result += ";" + namen[i];
    }
    result += '\n';

    for (var i = 0; i < gameTable[0].length; i++) {
        result += gameTable[i][0];
        for (var j = 1; j < number; j++) {
            result += ";" + gameTable[i][j];
        }
        result += '\n';
    }
    result += '\n';

    for (var i = 0; i < soloTable[0].length; i++) {
        result += soloTable[i][0];
        for (var j = 1; j < number; j++) {
            result += ";" + soloTable[i][j];
        }
        result += '\n';
    }
    result += '\n';

    result += punkte[0];
    for (var i = 1; i < number; i++) {
        result += ";" + punkte[i];
    }

    const d = new Date();

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function successCallback(fs) {
        fs.root.getFile('file:///storage/emulated/0/Download/doppelkopfErgebnis' + d.getTime() + ".csv", { create: true, exclusive: false }, successCallbackGet, errorCallbackGet);

        function successCallbackGet(fileEntry) {
            fileEntry.file(function (file) {


                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function () {
                        console.log("Successful file write...");
                    };

                    fileWriter.onerror = function (e) {
                        console.log("Failed file write: " + e.toString());
                    };

                    console.log("vor write");
                    fileWriter.write(result);
                    console.log("nach write");
                })

            }, errorCallback);
        }
    }, errorCallback);

    function errorCallbackGet(error) {
        alert("ERROR-CSV-GET: " + error.message)
    }

    function errorCallback(error) {
        alert("ERROR-CSV: " + error.message)
    }
    return;
}