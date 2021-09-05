function startNewGame(number) {
    localStorage.clear();
    if (number < 4 || number > 6) throw new IllegalArgumentException();
    localStorage.setItem("playerNo", number);
    localStorage.setItem("round", "1");
    var allowedDist = (number == 5) ? 1 : 0;
    localStorage.setItem("allowedDist", allowedDist);
    localStorage.setItem("allowedWinners", number - 1 - allowedDist);
    var punkte = [0, 0, 0, 0, 0, 0];
    localStorage.setItem("punkte", punkte.toString());
    gameTable = [[], [], [], [], [], []]; //jeweils 5 Felder für das laufend aktualisierte Ergebnis und ein Feld für die absoluten Punkte in dieser Runde
    soloTable = [[], [], [], [], [], []];
    localStorage.setItem("gameTable", JSON.stringify(gameTable));
    localStorage.setItem("soloTable", JSON.stringify(soloTable));
    window.location.assign("name.html");
}