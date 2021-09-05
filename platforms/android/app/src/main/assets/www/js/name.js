function style() { //sorgt dafür, dass immer die richtige Anzahl an Spielerfeldern erscheint und diese ansprechend formatiert sind
    players = localStorage.getItem("playerNo");
    if (players == 5) { //wenn 5 Spieler, blende Feld 6 aus und setze die Breite von Feld 5 von halbe auf volle Breite
        feld5 = document.getElementById("4");
        feld6 = document.getElementById("5");
        feld6.style.display = "none";
        feld5.classList.remove("hw");
        feld5.classList.add("fw");

    } else if (players == 4) { //wenn 4 Spieler, blende Felder 5 und 6 aus
        feld5 = document.getElementById("4");
        feld6 = document.getElementById("5");
        feld5.style.display = "none";
        feld6.style.display = "none";

    }


    var names = ["Spieler 1", "Spieler 2", "Spieler 3", "Spieler 4", "Spieler 5", "Spieler 6"]; //TODO 
    localStorage.setItem("namen", names.toString()); //TODO vernünftig setzen


}

var markedNameBtn = null;
var playerBtn = null;
var name = "";

function nameIt(pBtn) {
    if (markedNameBtn != null) {
        markedNameBtn.style.background = "orange";
    }
    name = "";
    document.getElementById("nameSelect").style.display = "block";
    playerBtn = pBtn;
}

function selName(nBtn) {
    if (markedNameBtn != null) {
        markedNameBtn.style.background = "orange";
    }
    nBtn.style.background = "lightgreen";
    if (nBtn.innerHTML != "NEUER NAME") {
        name = nBtn.innerHTML;
    } else {
        name = null;
    }
    markedNameBtn = nBtn;
}


function closeName(ok) {
    var modal = document.getElementById("nameSelect");

    var buttonID = Number(playerBtn.id);
    var entered = name;
    if (ok) {
        if (entered == "null") {
            var numtxt = buttonID + 1;
            entered = prompt("Bitte wähle einen Namen: ", "Spieler " + numtxt);
        }
        if(entered == "") entered = null;
        if (entered != null) {
            namen = localStorage.getItem("namen").split(",");
            namen[buttonID] = entered;
            playerBtn.innerHTML = entered;
            localStorage.setItem("namen", namen.toString())
        }
    }
    //markedNameBtn = null;
    name = null;
    modal.style.display = "none";


}