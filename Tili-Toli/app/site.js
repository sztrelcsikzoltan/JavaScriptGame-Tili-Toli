var button = document.getElementsByTagName("input")[0];
var scores = document.getElementsByTagName("h4")[0];
var title = document.getElementsByTagName("p")[0];

var arrayCells = document.getElementsByClassName("grid-item");
var arrayCells = [].slice.call(arrayCells); // convert HTMLCollection to array
arrayCells.unshift("");
var arrayNextCells = [];
var randomLocation;
// cellák feltöltése 1-15-ig véletlen sorrendben
for (let index = 1; index < 16; index++) {
    while (true) {
        randomLocation = Math.max(1, Math.floor(Math.random() * 16));
        if (arrayCells[randomLocation].innerHTML == "") {
            arrayCells[randomLocation].innerHTML = index;
            break;
        }
    }
}
var emptyCell = arrayCells[16];
var emptyCellLocation = 16;

setupCells();
checkStatus();
button.addEventListener("click", autoSolve);
onload('Arrange the numbers in ascending order by clicking on the squares at the empty cell!', 7000);

// cellák és események beállítása az üres négyzet körül
function setupCells() {
    arrayNextCells = []; // tömb elemeinek törlése
    if ((emptyCellLocation - 1) % 4 != 0) arrayNextCells.push(emptyCell.previousElementSibling);
    if (emptyCellLocation % 4 != 0) arrayNextCells.push(emptyCell.nextElementSibling);
    if (emptyCellLocation > 4) arrayNextCells.push(document.getElementById("btn-" + (emptyCellLocation - 4)));
    if (emptyCellLocation < 13) arrayNextCells.push(document.getElementById("btn-" + (emptyCellLocation + 4)));

    // console.clear();
    for (let i = 0; i < arrayNextCells.length; i++) {
        arrayNextCells[i].addEventListener("click", moveCell);
        arrayNextCells[i].addEventListener("mouseover", styleOver);
        arrayNextCells[i].addEventListener("mouseout", styleOut);
        arrayNextCells[i].style.backgroundColor = "lightgreen";
        // console.log("active cell", i + 1, ":", arrayNextCells[i].innerHTML);
    }
}

// cellák mozgatása
function moveCell(evt) {
    let cell = evt.currentTarget;
    let id = cell.id;
    let location = id.substring(4, 6);
    let number = cell.innerHTML;

    emptyCell.innerHTML = number; // cella tartalom kicserélése
    cell.innerHTML = "";
    emptyCell = cell;
    emptyCellLocation = location * 1; // az összeadáshoz szükséges, hogy szám legyen

    removeListeners();
    // styleOver beállítások törlése a már nem kattintható cellákról
    cell.style.color = "black";
    cell.style.borderColor = "black";
    cell.style.cursor = "default";
    setupCells();
    checkStatus();
}

function styleOver(evt) {
    let cell = evt.currentTarget;
    cell.style.color = "white";
    cell.style.borderColor = "white";
    cell.style.cursor = "pointer";
}

function styleOut(evt) {
    let cell = evt.currentTarget;
    cell.style.color = "black";
    cell.style.borderColor = "black";
    cell.style.cursor = "default";
}

function checkStatus() {
    let completed = 0;
    for (let index = 1; index < 17; index++) {
        if (arrayCells[index].innerHTML == index) {
            arrayCells[index].style.backgroundColor =
                "salmon";
            completed++;
        }
    }
    scores.innerHTML =
        "Completed: " + (completed) + " out of 15.";
    if (completed == 15) {
        // alert("You WON!!!");
        title.innerHTML = "YOU WON!";
        title.style.width = "420px";
        title.style.fontSize = "1.5em";
        title.style.fontWeight = "bold";
        title.style.backgroundColor = "lightgreen";
        title.style.color = "red";
        title.style.display = "block";
        button.value = "Start a new game";
        removeListeners();
    }
}

// események eltávolítása mozgatás után
function removeListeners() {
    for (let i = 0; i < arrayNextCells.length; i++) {
        arrayNextCells[i].removeEventListener("click", moveCell);
        arrayNextCells[i].removeEventListener("mouseover", styleOver);
        arrayNextCells[i].removeEventListener("mouseout", styleOut);
        if (button.value == "Auto solve next number") {
            arrayNextCells[i].style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }
    }
}

// következő szám jó helyre cserélése 
function autoSolve() {
    if (button.value == "Auto solve next number") {
        var i = 1;
        for (let index1 = 1; index1 < 17; index1++) {
            if (arrayCells[index1].innerHTML != index1) {
                // egy rossz szám áthelyezése jó helyre
                var wrongNumber = arrayCells[index1].innerHTML;
                var wrongNumberPos = index1;

                for (let index2 = index1; index2 < 17; index2++) {
                    if (arrayCells[index2].innerHTML == index1) { // ha megvan a jó szám
                        var rightNumber = index1;
                        var rightNumberPos = index2;

                        arrayCells[wrongNumberPos].innerHTML = rightNumber;
                        arrayCells[wrongNumberPos].style.backgroundColor = "salmon";

                        // üres cella cseréje esetén üres lesz az új cella értéke, és módosul az üres pozíciója
                        if (wrongNumber == 0) {
                            arrayCells[rightNumberPos].innerHTML = "";
                            emptyCell = arrayCells[rightNumberPos];
                            emptyCellLocation = rightNumberPos * 1;
                            // eventek törlése, újra számolás
                            removeListeners();
                            setupCells();
                        } else {
                            arrayCells[rightNumberPos].innerHTML = wrongNumber;
                        }
                        i++;
                        break;
                    }
                }
            }
            if (i > 1) break;
        }
        checkStatus();
    } else {
        location.reload();
    }
}

// súgó üzenet indításkor
function onload(message, duration) {
    var el = document.createElement("div");
    el.setAttribute("style", "margin-left:auto;margin-right:auto;width:380px; background-color: salmon; color:white; padding: 20px; font-size: 1.3em; border-radius: 10px;");
    el.innerHTML = message;
    setTimeout(function() {
        // néhány másodperc múlva infó elrejtése, pontszám és gomb megjelenítése
        el.parentNode.removeChild(el);
        title.style.display = "none";
        scores.style.visibility = "visible";
        button.style.visibility = "visible";
    }, duration);
    document.getElementsByClassName("container")[0].appendChild(el);
}