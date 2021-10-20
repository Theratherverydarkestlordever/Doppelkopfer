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
    hatSolo = [0,0,0,0,0]; //Markierung für das Pflichtsolo
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
    window.location.assign("name.html");
}



function writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function () {
            console.log("Successful file write...");
            //readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
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

var readResult;


/*
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    //onDeviceReady2();

    readFile();


}

function readFile() {

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function successCallback(fs) {
        fs.root.getFile('names.txt', { create: true, exclusive: false }, successCallbackGet, errorCallback);

        function successCallbackGet(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    readResult = this.result;
                    if (readResult == null) readResult = "heyho";
                    alert(readResult);
                };
                reader.readAsText(file);
            }, errorCallback);
        }
    }, errorCallback);

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }
}

/*

// TEST FOR FILE-SYSTEM
function onErrorLoadFs() {
    alert("an error occured while accessing file system");
}

function onErrorCreateFile() {
    alert("an error occured while writing a file");
}

document.addEventListener("deviceready", onDeviceReady, false);

function createFile(fs) {
    try {
        $("body").append("<p>trying to create file...</p>");
        fs.root.getFile("names.txt", { create: true, exclusive: false }, function(fileEntry) {

            $("body").append("fileEntry is file? " + fileEntry.isFile.toString());
            // fileEntry.name == 'someFile.txt'
            // fileEntry.fullPath == '/someFile.txt'
            writeFile(fileEntry, "hello");

        }, onErrorCreateFile);
    } catch (e) {
        $("body").append("<p>(create): " + e.stack + "</p>");
    }

    /*
    $("body").append("<p>trying to read file...</p>");
    fs.root.getFile('names.txt', {}, function(fileEntry) {

        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                $("body").append("<p>" + this.result + "</p>");
            };
            reader.readAsText(file);
        }, errorCallback);
    }, errorCallback);


}

function successCallback(fs) {

}

function errorCallback(error) {
    alert("ERROR: " + error.code)
}

function onDeviceReady2() {

    try {
        var filesystem = null;
        $("body").append("<p>deviceready triggered</p>");
        $("body").append("<p>File-System (DEBUG):</p>");
        //$("body").append("<p>" + cordova.file.toString() + "</p>");


        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {

            $("body").append("<p>file system open: " + fs.name + "</p>");
            alert("fs " + fs);
            alert("fs.name " + fs.name);
            filesystem = fs;

        }, onErrorLoadFs);

        //filesystem = openFS();

        setTimeout(function() {
            alert("filesystem: " + filesystem);
            createFile(filesystem);

            //$("body").append("<p>trying to read file...</p>");

            $("body").append("<p>End File-System (DEBUG)</p>");

        }, 3000);
    } catch (e) {
        $("body").append("<p>(main): " + e.stack + "</p>");
    }
} */