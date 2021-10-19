document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log("device is ready")
    importNames(null);
}

function importNames(newName) {
    //console.log("got this new name: " + newName);
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function successCallback(fs) {
        fs.root.getFile('names.txt', { create: true, exclusive: false }, successCallbackGet, errorCallbackGet);

        function successCallbackGet(fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    readResult = this.result;
                    try {
                        readResult = JSON.parse(readResult);
                    } catch (e) {
                        console.log("was faulty. i have to go for hardcoded backup");
                        readResult = ["Chris", "Edel", "Gerd", "Lars", "Lena", "Michael", "Peter", "René", "Stephan", "Tanja", "Werner"];
                    } finally {

                        if (newName != "" && newName != null && !readResult.includes(newName)) {
                            readResult.push(newName);
                            console.log("pushed " + newName);
                        }
                        console.log("readResult vor write: " + readResult);
                        writeNamesPersistently(fileEntry, Array.from(readResult));
                        readResult.sort();
                        readResult.push("NEUER NAME");
                        createNameButtons(readResult);
                    }
                };
                reader.readAsText(file);
            }, errorCallback);
        }
    }, errorCallback);

    function errorCallbackGet(error) {
        alert("ERROR-GET: " + error.message)
    }

    function errorCallback(error) {
        alert("ERROR: " + error.message)
    }
    return;
}

function createNameButtons(names) {
    var rowCnt = 1;
    $("#nameTbl").append("<tr id='row" + rowCnt++ + "'>");
    $("#nameTbl").append('<td onclick="selName(this)">' + names[0] + '</td>');
    for (i = 1; i < names.length; i++) {
        if (i % 3 == 0) {
            $("#nameTbl").append("</tr>");
            $("#nameTbl").append("<tr id='row" + rowCnt++ + "'>");
        }
        $("#nameTbl").append('<td onclick="selName(this)">' + names[i] + '</td>');
    }
    $("#nameTbl").append("</tr>");
}

async function writeNamesPersistently(fileEntry, names) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function () {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        fileWriter.write(JSON.stringify(names));
    })
}

markedNameBtn = [];
names = [];

function selName(nBtn) {

    if (nBtn.innerHTML == "NEUER NAME") {
        var entered = prompt("Bitte wähle einen Namen: ", "");
        if (entered == "" || entered == null) return;
        addNameBtn(entered);
        /*
        for( i=0;i<markedNameBtn.length;i++) {
            styleSelectedBtn(markedNameBtn[i]);
        }
        */
       names = [];
       markedNameBtn = [];
        return;
    }

    var number = localStorage.getItem("playerNo");
    var btnIdx = markedNameBtn.indexOf(nBtn);

    if (btnIdx >= 0) { //wenn Name schon ausgewählt wurde und jetzt nochmal ausgewählt wird, wähle ab
        names.splice(btnIdx, 1);
        markedNameBtn.splice(btnIdx, 1);
        styleUnselectedBtn(nBtn);
    } else { //wähle button aus
        names.push(nBtn.innerHTML);
        markedNameBtn.push(nBtn);
        styleSelectedBtn(nBtn);
    }

    if (markedNameBtn.length == number) {
        document.getElementById("nameReadyBtn").disabled = false;
    } else {
        document.getElementById("nameReadyBtn").disabled = true;
    }

    if (markedNameBtn.length > 0) {
        document.getElementById("nameDelBtn").disabled = false;
    } else {
        document.getElementById("nameDelBtn").disabled = true;
    }

    console.log(names);

}

function styleSelectedBtn(nBtn) {
    nBtn.style.background = "lightgreen";
}

function styleUnselectedBtn(nBtn) {
    nBtn.style.background = "orange";
}

function addNameBtn(name) {
    $('#nameTbl').empty();
    importNames(name);
    /*
    var rows = document.getElementById("nameTbl").childElementCount;
    var columnsLastRow = document.getElementById("row" + rows);
    if (columnsLastRow >= 4) {
        $("#nameTbl").append("<tr id='row" + rows + "'>");
        $("#nameTbl").append('<td onclick="selName(this)">' + name + '</td>');
        $("#nameTbl").append("</tr>");
    } else{
        $("#row"+rows).append('<td onclick="selName(this)">' + name + '</td>');
    }
    */
}

function deleteNames() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function successCallback(fs) {
        fs.root.getFile('names.txt', { create: true, exclusive: false }, successCallbackGet, errorCallbackGet);

        function successCallbackGet(fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    readResult = this.result;
                    try {
                        readResult = JSON.parse(readResult);
                        console.log("vor entfernen " + readResult);
                        for (i = 0; i < names.length; i++) {
                            console.log(names[i]);
                            var x = readResult.indexOf(names[i]);
                            if (x >= 0) readResult.splice(x, 1); // remove 1 element beginning at pos x
                        }
                        console.log("nach entfernen " + readResult);
                        names = [];
                        markedNameBtn = [];
                    } catch (e) {
                        console.log("read for delete was faulty.");
                        console.log(e.message);
                        alert("Namen konnten nicht gelöscht werden. Problem beim Dateizugriff!");
                        return;
                    } finally {
                        writeNamesPersistently(fileEntry, Array.from(readResult));
                        $('#nameTbl').empty();
                        readResult.sort();
                        readResult.push("NEUER NAME");
                        createNameButtons(readResult);
                    }

                };
                reader.readAsText(file);
            }, errorCallback);
        }
    }, errorCallback);

    function errorCallbackGet(error) {
        alert("ERROR-GET: " + error.message)
    }

    function errorCallback(error) {
        alert("ERROR: " + error.message)
    }
    return;
}

function closeNames(){
    localStorage.setItem("namen", names.toString());
    window.location.assign('game.html');
}