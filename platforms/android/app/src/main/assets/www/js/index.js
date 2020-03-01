var markedWinners = 0; //Anzahl markierter Gewinner
var markedDist = false; //Geber gesetzt ?
var marking = [0, 0, 0, 0, 0, 0] //Speicher für Markierungen
var players = 0; //registrierte Spielerzahl
var allowedWinners = 0; //Anzahl erlaubter Gewinner
var allowedDist = 0; //Anzahl erlaubter Geber

function startNewGame(number) {
    if (number < 4 || number > 6) throw new IllegalArgumentException();
    players = number;
    allowedWinners = number / 2; //gilt das?
    allowedDist = (number == 5) ? 1 : 0; //gilt das?
    changePage("game", "none");

}

function style() {
    if (players == 5) {
        feld5 = document.getElementById("player5");
        feld6 = document.getElementById("player6");
        feld6.style.display = "none";
        feld5.classList.remove("hwBox");
        feld5.classList.add("fwBox");

    } else if (players == 4) {
        feld5 = document.getElementById("player5");
        feld6 = document.getElementById("player6");
        feld5.style.display = "none";
        feld6.style.display = "none";
    }
}

function mark(button) { //sorgt fuer korrekte Markierung der Spieler
    buttonID = 7 // TODO ID Abfragen
    if (marking[buttonID - 1] == 0) { //wenn Status = 0, mache zu Gewinner
        if (marked + 1 <= allowedWinners) {
            marking[buttonID - 1] = 1;
            markedWinners++;
        }
    } else if (marking[buttonID - 1] == 1) { //wenn Gewinner, mache zu Geber
        if (!markedDist) {
            marking[buttonID - 1] = 2;
            markedWinners--;
            markedDist = true;
        }
    } else if (marking[buttonID - 1] == 2) { //wenn Geber, setze Status = 0
        marking[buttonID - 1] = 2;
        markedDist = false;
    }
    updateButtonColors(); //TODO

}

function resetMarking() {
    marking = [0, 0, 0, 0, 0, 0];
    marked = 0;
}

function changePage(target, dir) { //bekommt die Zielseite und eine kurze Info, in welche Ebene man sich in der Ordnerstruktur bewegen soll
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