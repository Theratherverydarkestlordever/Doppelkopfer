var markedWinners = 0; //Anzahl markierter Gewinner
var markedDist = false; //Geber gesetzt ?
var marking = [0, 0, 0, 0, 0, 0] //Speicher für Markierungen
var namenswahl = false;

function startNewGame(number) {
    localStorage.clear();
    if (number < 4 || number > 6) throw new IllegalArgumentException();
    localStorage.setItem("playerNo", number);
    localStorage.setItem("allowedWinners", number - 1); //oder konstant drei?
    var allowedDist = (number == 5) ? 1 : 0;
    localStorage.setItem("allowedDist", allowedDist);
    var punkte = [0, 0, 0, 0, 0, 0];
    localStorage.setItem("punkte", punkte.toString());
    //parent.document.getElementById("testNo").innerHTML = localStorage.getItem("playerNo");

}


function style() { //sorgt dafür, dass immer die richtige Anzahl an Spielerfeldern erscheint und diese ansprechend formatiert sind
    players = localStorage.getItem("playerNo");
    if (players == 5) { //wenn 5 Spieler, blende Feld 6 aus und setze die Breite von Feld 5 von halbe auf volle Breite
        feld5 = document.getElementById("4");
        feld6 = document.getElementById("5");
        feld6.style.display = "none";
        feld5.classList.remove("hwBox");
        feld5.classList.add("fwBox");

    } else if (players == 4) { //wenn 4 Spieler, blende Felder 5 und 6 aus
        feld5 = document.getElementById("4");
        feld6 = document.getElementById("5");
        feld5.style.display = "none";
        feld6.style.display = "none";
    }

    if (localStorage.getItem("runde") == null) {
        namenswahl = true;
    }
    var names = ["Spieler 1", "Spieler 2", "Spieler 3", "Spieler 4", "Spieler 5", "Spieler 6"]; //TODO 
    localStorage.setItem("namen", names.toString()); //TODO vernünftig setzen
    document.getElementById("scr").style.display = "none";
    document.getElementById("tbl").style.display = "none";
    document.getElementById("scr").disabled = true;

}

function finishNames() {
    namenswahl = false;
    document.getElementById("round").innerHTML = "Runde 1"; //TODO Rundenzahl
    //TODO Buttons vernünftig ausblenden
    //document.getElementById("scr").style.disabled = true;
    nextRound();
}

function mark(button) { //sorgt fuer korrekte Markierung der Spieler
    var buttonID = Number(button.id); // TODO ID Abfragen
    if (namenswahl) {
        var entered = prompt("Bitte wähle einen Namen: ", "Spieler " + (buttonID + 1));
        if (entered != null) {
            namen = localStorage.getItem("namen").split(",");
            namen[buttonID] = entered;
            button.innerHTML = entered;
            localStorage.setItem("namen", namen.toString())
        }
    } else {
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
            document.getElementById("scr").disabled = false;
        } else {
            document.getElementById("scr").disabled = true;
        }
        updateButtonStyle(button.id, marking[buttonID]);
    }



}

function updateButtonStyle(buttonID, state) { //aktualisiert Farbe und Text der Spielerfelder
    var button = document.getElementById(buttonID);
    var name = namen = localStorage.getItem("namen").split(",")[buttonID];
    var color;
    var text = button.innerHTML;
    switch (state) {
        case 0:
            color = "blue";
            text = "";
            break;
        case 1:
            color = "yellow";
            text = "(Sieger)";
            break;
        case 2:
            color = "green";
            text = "(Geber)";
            break;
        default:
            throw new IllegalArgumentException();
    }
    button.style.backgroundcolor = color;
    button.innerHTML = namen + " \n " + text;
}

//LISTE:
// - Namensarray
// - Knöpfe bennenbar machen

function resetMarking() { //Setzt Markierungen zurück
    marking = [0, 0, 0, 0, 0, 0];
    markedWinners = 0;
    for (i = 0; i < 6; i++) updateButtonStyle(i, 0);

}

/*
var okBtn = document.getElementById("ok");
var abBtn = document.getElementById("abort");

okBtn.onclick(close(true));
abBtn.onclick(close(false));
*/

var score = 0;

function scoring() { //Ist für das Öffnen der Punkteauswahl mit richtigen Namen veranwtortlich
    var allowedWinners = localStorage.getItem("allowedWinners");
    var allowedDist = localStorage.getItem("allowdDist");
    var modal = document.getElementById("scoreSelect");
    var gewNamen = "";
    var namen = localStorage.getItem("namen").split(",");

    for (i = 0; i < 6; i++) { //alle Spieler auf Status 1 werden als Gewinner herausgesucht
        if (marking[i] == 1) {
            gewNamen = gewNamen + " " + namen[i];
        }
    }
    document.getElementById("winTxt").innerHTML = gewNamen;
    modal.style.display = "block";
}

function setScore(value) { //aktualisiert bei Klick auf ein Punktefeld die angezeigte Zahl und die Variable
    score = value;
    document.getElementById("pointTxt").innerHTML = score;
}


function closer(set) { //Schließt die Punkteauswahl und übernimmt die Punkte bei true, verwirft sie bei false //TODO FERTIG //warum wird nicht ausgeführt?
    var modal = document.getElementById("scoreSelect");
    var punkte = localStorage.getItem("punkte").split(",");
    if (set) {
        for (i = 0; i < 6; i++) { //allen Spieler auf Status 1 werden Punkte gegeben
            if (marking[i] == 1) {
                punkte[i] = parseInt(punkte[i]) + score;
            }
        }
        localStorage.setItem("punkte", punkte.toString())
    } else {}
    modal.style.display = "none";
    score = 0;
    nextRound();
}

styled = false;

function nextRound() {
    resetMarking();
    if (!namenswahl && !styled) {
        document.getElementById("scr").style.display = "inline";
        document.getElementById("tbl").style.display = "inline";
        document.getElementById("nms").style.display = "none";
        styled = true;
    }
    //document.getElementById("nextBtn").disabled = true;
    var round = localStorage.getItem("round");
    document.getElementById("round").innerHTML = "Runde " + ++round;
    localStorage.setItem("round", round);
    document.getElementById("scr").disabled = true;
}

function showResult() {
    document.getElementById("table").style.display = "block";
    //TODO Punkte vernünftig anzeigen
}

function closeTable() {
    document.getElementById("table").style.display = "none";
}


/* Relikte, die aus einer Umstrukturierung der Seitenstruktur übrig sind. Werden bald gelöscht.
function changePageL(target, dir) { //bekommt die Zielseite und eine kurze Info, in welche Ebene man sich in der Ordnerstruktur bewegen soll
    link = ""
    switch (dir) {
        case "down":
            link = "pages/" + target;
            break;
        case "up":
            link = "../" + target;
            break;
        default:
            link = target;
    }
    window.open(link + ".html", "_self");
}

function changePage(target, x) { //, link, marked) { //gets the target page, the link its called from and a boolean if the calling link shall be set .active. Changes the src page of the iframe
    document.getElementById("frame").src = "#";
    document.getElementById("frame").src = "pages/" + target + ".html";
}

function changePageChild(target, x) { //, link, marked) { //See above, only for calling from within iframecontent
    //currPage = target;
    //parent.changePage(target, x) //, link, marked);
    parent.document.getElementById("frame").src = "#";
    parent.document.getElementById("frame").src = "pages/" + target + ".html";
}

*/