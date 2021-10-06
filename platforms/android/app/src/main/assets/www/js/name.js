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

document.addEventListener("deviceready", importNames, false);

function importNames() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function successCallback(fs) {
        fs.root.getFile('names.txt', { create: true, exclusive: false }, successCallbackGet, errorCallback);

        function successCallbackGet(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    readResult = this.result;
                    console.log("readResult: " + readResult);
                    if (readResult == null) {
                        console.log("i have to go for hardcoded backup");
                        readResult = ["Chris", "Edel", "Gerd", "Lars", "Lena", "Michael", "Peter", "René", "Stephan", "Tanja", "Werner"];
                        fileEntry.createWriter(function(fileWriter) {

                                fileWriter.onwriteend = function() {
                                    console.log("Successful file write...");
                                    //readFile(fileEntry);
                                };

                                fileWriter.onerror = function(e) {
                                    console.log("Failed file write: " + e.toString());
                                };

                                fileWriter.write(JSON.stringify(readResult));
                            }
                            //exportNames(JSON.stringify(readResult));
                        )
                    } else {
                        console.log("i can read persistent file");
                        try {
                            readResult = JSON.parse(readResult);
                        } catch (e) {
                            fileEntry.remove(function() {
                                console.log('File removed.');
                            }, errorCallback);
                            console.log("was faulty. i have to go for hardcoded backup");
                            readResult = ["Chris", "Edel", "Gerd", "Lars", "Lena", "Michael", "Peter", "René", "Stephan", "Tanja", "Werner"];
                            exportNames(JSON.stringify(readResult));
                        }
                        readResult.sort();
                    }
                    readResult.push("NEUER NAME");
                    console.log(readResult);
                    $("#nameTbl").append("<tr>");
                    $("#nameTbl").append('<td onclick="selName(this)">' + readResult[0] + '</td>');
                    for (i = 1; i < readResult.length; i++) {
                        if (i % 3 == 0) {
                            $("#nameTbl").append("</tr>");
                            $("#nameTbl").append("<tr>");
                        }
                        $("#nameTbl").append('<td onclick="selName(this)">' + readResult[i] + '</td>');
                    }
                    $("#nameTbl").append("</tr>");
                };
                reader.readAsText(file);
            }, errorCallback);
        }
    }, errorCallback);

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }
}

function exportNames(dataObj) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {

        fs.root.getFile("names.txt", { create: true, exclusive: false }, function(fileEntry) {

            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function(fileWriter) {

                fileWriter.onwriteend = function() {
                    console.log("Successful file write...");
                    //readFile(fileEntry);
                };

                fileWriter.onerror = function(e) {
                    console.log("Failed file write: " + e.toString());
                };

                // If data object is not passed in,
                // create a new Blob instead.
                if (!dataObj) {
                    dataObj = new Blob(['some file data'], { type: 'text/plain' });
                    alert("an error occurred while writing the names into the file");
                }

                fileWriter.write(dataObj);
            });

        }, onErrorCreateFile);

    }, onErrorLoadFs);

    //filesystem = openFS();

    setTimeout(function() {
        alert("filesystem: " + filesystem);
        createFile(filesystem);

        //$("body").append("<p>trying to read file...</p>");

        $("body").append("<p>End File-System (DEBUG)</p>");

    }, 3000);

    $("body").append("<p>trying to create file...</p>");
    fs.root.getFile("names.txt", { create: true, exclusive: false }, function(fileEntry) {

        $("body").append("fileEntry is file? " + fileEntry.isFile.toString());
        // fileEntry.name == 'someFile.txt'
        // fileEntry.fullPath == '/someFile.txt'
        writeFile(fileEntry, "hello");

    }, onErrorCreateFile);

    function writeFile(fileEntry, dataObj) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function(fileWriter) {

            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
                //readFile(fileEntry);
            };

            fileWriter.onerror = function(e) {
                console.log("Failed file write: " + e.toString());
            };

            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
                dataObj = new Blob(['some file data'], { type: 'text/plain' });
            }

            fileWriter.write(dataObj);
        });
    }
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
        if (entered == "") entered = null;
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