function startNewGame(number) {
    localStorage.clear();
    if (number < 4 || number > 6) throw new IllegalArgumentException();
    localStorage.setItem("playerNo", number);
    localStorage.setItem("round", "1");
    var allowedDist = (number == 5) ? 1 : 0;
    localStorage.setItem("allowedDist", allowedDist);
    localStorage.setItem("allowedWinners", number - 1 - allowedDist); //oder konstant drei?
    var punkte = [0, 0, 0, 0, 0, 0];
    localStorage.setItem("punkte", punkte.toString());
    //parent.document.getElementById("testNo").innerHTML = localStorage.getItem("playerNo");
    window.location.assign("name.html");
}