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
    console.log(Math.round(round / players) * players + "==" + round);
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
        for (i = 0; i < 6; i++) document.getElementById(i).style.display = "none";
        document.getElementById("scr").style.display = "none";
        document.getElementById("end").style.display = "none";
        document.getElementById("tutorialText").style.display = "none";
        document.getElementById("tutorialText2").style.display = "none";
        var string = "Ergebnis nach " + (localStorage.getItem("round") - 1) + " Spielen";
        document.getElementById("round").innerHTML = string;
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
    console.log("set style for "+namen+" as "+text);
    if(wins != 0){
        setScore(-1);
        var x = 0;
    }
    return;
}


function resetMarking() { //Setzt Markierungen zurück
    marking = [0, 0, 0, 0, 0, 0];
    markedWinners = 0;
    markedDist = false;
    for (i = 0; i < 6; i++){
        console.log("trying to set style "+i);
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

    for (i = 0; i < number; i++) { //alle Spieler auf Status 1 werden als Gewinner herausgesucht
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
    console.log("Pscore: " + Pscore);
    console.log("Mscore: " + Mscore);
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
    for (i = 0; i < 20; i++) {
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


function closeScore() { //Schließt die Punkteauswahl und übernimmt die Punkte bei true, verwirft sie bei false
    var modal = document.getElementById("scoreSelect");
    var punkte = localStorage.getItem("punkte").split(",");
    var number = localStorage.getItem("playerNo");
    var gameTable = JSON.parse(localStorage.getItem("gameTable"));
    var soloTable = JSON.parse(localStorage.getItem("soloTable"));
    var hatSolo = JSON.parse(localStorage.getItem("hatSolo"));
    var cntGewinner = 0;

    for (i = 0; i < number; i++) { //allen Spieler auf Status 1 werden Punkte gegeben
        if (marking[i] == 1) { //GEWINNER
            punkte[i] = parseInt(punkte[i]) + Pscore;
            //gameTable[i].push(punkte[i]);
            cntGewinner++;
        } else if (marking[i] == 0) { //VERLIERER
            punkte[i] = parseInt(punkte[i]) - Mscore;
            //gameTable[i].push(punkte[i]);

        } else if (marking[i] == 2) { //GEBER
            //gameTable[i].push('G'); //TODO oder lieber 0, also den Wert von vorher?
        } else {
            alert("Fehler bei der Punktvergabe: Ungültiger Statuswert!");
        }
    }


    if ((cntGewinner == 1 || cntGewinner == 3) && hatSolo[number] == 0) { //SOLO
        var solo = (cntGewinner == 1) ? marking.indexOf(1) : marking.indexOf(0);
        if (solo == -1) {
            alert("error while computing solo!");
            return;
        }
        if (hatSolo[solo] == 0) {
            hatSolo[solo] = 1;
            for (i = 0; i < number; i++) {
                if (marking[i] == 1) { //GEWINNER
                    soloTable[i].push(Pscore);
                } else if (marking[i] == 0) { //VERLIERER
                    soloTable[i].push((-1) * Mscore);
                } else if (marking[i] == 2) { //GEBER
                    soloTable[i].push('G'); //TODO oder lieber 0, also den Wert von vorher?
                } else {
                    alert("Fehler bei der Punktvergabe: Ungültiger Statuswert!");
                }
            }
            soloTable[number].push(localStorage.getItem("round"));
        }

    } else {

        for (i = 0; i < number; i++) { //allen Spieler auf Status 1 werden Punkte gegeben
            if (marking[i] == 1) { //GEWINNER
                gameTable[i].push(punkte[i]);
            } else if (marking[i] == 0) { //VERLIERER
                gameTable[i].push(punkte[i]);
            } else if (marking[i] == 2) { //GEBER
                gameTable[i].push('G'); //TODO oder lieber 0, also den Wert von vorher?
            } else {
                alert("Fehler bei der Punktvergabe: Ungültiger Statuswert!");
            }
        }
        gameTable[number].push(Pscore);
    }

    localStorage.setItem("punkte", punkte.toString())
    localStorage.setItem("gameTable", JSON.stringify(gameTable));
    localStorage.setItem("soloTable", JSON.stringify(soloTable));
    localStorage.setItem("hatSolo", JSON.stringify(hatSolo));
    nextRound();


    Pscore = 0;
    Mscore = 0;
    wins = 0;
    resetButtonStyleScore();
    return;
}

styled = false;

function nextRound() {
    resetMarking();
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
    for (i = 0; i < number; i++) {
        row += "\n<th scope='col'>" + namen[i] + "</th>";
    }
    row += "\n</thead>\n</tr>";
    $("#queryTableGames").append(row);

    $("#queryTableGames").append("<tbody>");

    for (j = 0; j < round; j++) {
        row = "<tr>";
        row += "<th scope='row'>" + (j + 1) + "</th>";
        row += "<td>" + gameTable[number][j] + "</td>";

        for (i = 0; i < number; i++) {
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
        for (i = 0; i < number; i++) {
            row += "\n<th scope='col'>" + namen[i] + "</th>";
        }
        row += "\n</thead>\n</tr>";
        $("#queryTableSolo").append(row);

        $("#queryTableSolo").append("<tbody>");
        for (j = 0; j < soloTable[0].length; j++) {
            row = "<tr>";
            row += "<th scope='row'>S" + (j + 1) + "</th>";
            row += "<td>" + soloTable[number][j] + "</td>";

            for (i = 0; i < number; i++) {
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
    for (i = 0; i < number; i++) {
        row += "\n<th scope='col'>" + namen[i] + "</th>";
    }
    row += "\n</thead>\n</tr>";
    $("#queryTableResult").append(row);

    $("#queryTableResult").append("<tbody>");

    row = "<tr>";
    for (i = 0; i < number; i++) {
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