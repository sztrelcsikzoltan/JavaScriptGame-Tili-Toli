var emptyCell;
var cellLeft;
var cellRight;
var cellUpper;
var cellLower;
var button = document.getElementsByTagName("input")[0];
var scores = document.getElementsByTagName("h4")[0];

var arrayCells = new Array();
for (let index = 1; index < 16; index++) {
    arrayCells[index] = index;
}
randomArray(arrayCells);

// cellák feltöltése 1-15-ig véletlen sorrendben
for (let index = 1; index < 16; index++) {
    document.getElementById("btn-" + index).innerHTML = arrayCells[index];
}
arrayCells.push(0); // üres cella hozzáadása tömbhöz 0 értékkel
var emptyCellLocation = 16;
var arrayNextCells = new Array();
setupCells(emptyCellLocation);
// setupCells0(emptyCellLocation);
checkStatus();
button.addEventListener("click", autoSolve);
onload('Arrange the numbers in ascending order by clicking on the squares next to the empty cell!', 8000);

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function randomArray(array) {
    let currentIndex = array.length,
        randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 1) {
        // Pick a remaining element...
        randomIndex = Math.max(1, Math.floor(Math.random() * currentIndex));
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}



function setupCells(emptyCellLocation) {
    arrayNextCells = [];
    emptyCell = document.getElementById("btn-" + emptyCellLocation);
    if ((emptyCellLocation - 1) % 4 != 0) arrayNextCells.push(emptyCell.previousElementSibling);
    if (emptyCellLocation % 4 != 0) arrayNextCells.push(emptyCell.nextElementSibling);
    if (emptyCellLocation > 4) arrayNextCells.push(document.getElementById("btn-" + (emptyCellLocation - 4)));
    if (emptyCellLocation < 13) arrayNextCells.push(document.getElementById("btn-" + (emptyCellLocation + 4)));
    // console.log(arrayNextCells);
    for (let i = 0; i < arrayNextCells.length; i++) {
        arrayNextCells[i].addEventListener("click", moveCell);
        arrayNextCells[i].addEventListener("mouseover", styleOver);
        arrayNextCells[i].addEventListener("mouseout", styleOut);
        arrayNextCells[i].style.backgroundColor = "lightgreen";
        console.log("active cell", i + 1, ":", arrayNextCells[i].innerHTML);
    }
}

function setupCells0(emptyCellLocation) {
    emptyCell = document.getElementById("btn-" + emptyCellLocation);
    // console.log(arrayCells);
    // nem fut le, ha bal oldalon nincs cella: ha (emptyCellLocation - 1) osztható 4-gyel
    cellLeft = (emptyCellLocation - 1) % 4 == 0 ? null : emptyCell.previousElementSibling; // previous cell
    console.log("left: ", cellLeft);
    // nem fut le, ha jobb oldalon nincs cella: ha emptyCellLocation osztható 4-gyel
    cellRight = emptyCellLocation % 4 == 0 ? null : emptyCell.nextElementSibling; // next cell
    console.log("right: ", cellRight);
    cellUpper = emptyCellLocation <= 4 ? null : document.getElementById("btn-" + (emptyCellLocation - 4)); // upper cell
    console.log("upper: ", cellUpper);
    cellLower = emptyCellLocation >= 13 ? null : document.getElementById("btn-" + (emptyCellLocation + 4)); // lower cell
    console.log("lower: ", cellLower);

    if (cellLeft != null) {
        cellLeft.addEventListener("click", moveCell);
        cellLeft.addEventListener("mouseover", styleOver);
        cellLeft.addEventListener("mouseout", styleOut);
        cellLeft.style.backgroundColor = "lightgreen";
    }
    if (cellRight != null) {
        cellRight.addEventListener("click", moveCell);
        cellRight.addEventListener("mouseover", styleOver);
        cellRight.addEventListener("mouseout", styleOut);
        cellRight.style.backgroundColor = "lightgreen";
    }
    if (cellUpper != null) {
        cellUpper.addEventListener("click", moveCell);
        cellUpper.addEventListener("mouseover", styleOver);
        cellUpper.addEventListener("mouseout", styleOut);
        cellUpper.style.backgroundColor = "lightgreen";
    }
    if (cellLower != null) {
        cellLower.addEventListener("click", moveCell);
        cellLower.addEventListener("mouseover", styleOver);
        cellLower.addEventListener("mouseout", styleOut);
        cellLower.style.backgroundColor = "lightgreen";
    }
}

function moveCell(evt) {
    let cell = evt.currentTarget;
    let id = cell.id;
    let location = id.substring(4, 6);
    let number = cell.innerHTML;

    // styleOver beállítások törlése
    cell.style.color = "black";
    cell.style.borderColor = "black";
    cell.style.cursor = "default";

    // üres és kiválasztott cella érték kicserélése a tömbben
    [arrayCells[location], arrayCells[emptyCellLocation]] = [
        arrayCells[emptyCellLocation],
        arrayCells[location],
    ];

    emptyCell.innerHTML = number;
    cell.innerHTML = "";
    emptyCellLocation = location * 1; // az összeadáshoz szükséges, hogy szám legyen

    removeListeners();
    // removeListeners0();
    setupCells(emptyCellLocation);
    // setupCells0(emptyCellLocation);
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
    let i = 1;
    for (let index = 1; index < 17; index++) {
        if (arrayCells[index] == index) {
            document.getElementById("btn-" + index).style.backgroundColor =
                "salmon";
            i++;
        }
    }
    scores.innerHTML =
        "Completed: " + (i - 1) + " out of 15.";
    if (i == 16) {
        // alert("You WON!!!");
        let title = document.getElementsByTagName("p")[0];
        title.innerHTML = "YOU WON!"
        title.style.width = "420px";
        title.style.fontSize = "1.5em";
        title.style.fontWeight = "bold";
        title.style.backgroundColor = "lightgreen";
        title.style.color = "red";
        button.value = "Start a new game";
        removeListeners();
        // removeListeners0();
    }
}

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

function removeListeners0() {
    if (cellLeft != null) {
        cellLeft.removeEventListener("click", moveCell);
        cellLeft.removeEventListener("mouseover", styleOver);
        cellLeft.removeEventListener("mouseout", styleOut);
        if (button.value == "Auto solve next number") {
            cellLeft.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }
    }
    if (cellRight != null) {
        cellRight.removeEventListener("click", moveCell);
        cellRight.removeEventListener("mouseover", styleOver);
        cellRight.removeEventListener("mouseout", styleOut);
        if (button.value == "Auto solve next number") {
            cellRight.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }
    }
    if (cellUpper != null) {
        cellUpper.removeEventListener("click", moveCell);
        cellUpper.removeEventListener("mouseover", styleOver);
        cellUpper.removeEventListener("mouseout", styleOut);
        if (button.value == "Auto solve next number") {
            cellUpper.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }
    }
    if (cellLower != null) {
        cellLower.removeEventListener("click", moveCell);
        cellLower.removeEventListener("mouseover", styleOver);
        cellLower.removeEventListener("mouseout", styleOut);
        if (button.value == "Auto solve next number") {
            cellLower.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }
    }
}

function autoSolve() {
    if (button.value == "Auto solve next number") {


        var i = 1;
        for (let index1 = 1; index1 < 17; index1++) {
            if (arrayCells[index1] != index1) {
                // egy szám áthelyezése jó helyre
                var wrongNumber = arrayCells[index1];
                var wrongNumberPos = index1;

                for (let index2 = index1; index2 < 17; index2++) {
                    if (arrayCells[index2] == index1) {
                        var rightNumber = index1;
                        var rightNumberPos = index2;
                        [arrayCells[index1], arrayCells[index2]] = [
                            arrayCells[index2],
                            arrayCells[index1],
                        ];
                        document.getElementById("btn-" + wrongNumberPos).innerHTML =
                            rightNumber;
                        document.getElementById(
                            "btn-" + wrongNumberPos
                        ).style.backgroundColor = "salmon";

                        // üres cella esetén üres lesz az új cella értéke, és módosul az üres pozíciója
                        if (wrongNumber == 0) {
                            document.getElementById("btn-" + rightNumberPos).innerHTML = "";
                            var rightNumberPos = index2;
                            emptyCellLocation = rightNumberPos * 1;
                            removeListeners();
                            // removeListeners0();
                            setupCells(emptyCellLocation);
                            // setupCells0(emptyCellLocation);
                        } else {
                            document.getElementById(
                                "btn-" + rightNumberPos).innerHTML = wrongNumber;
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

function onload(message, duration) {
    var el = document.createElement("div");
    el.setAttribute("style", "margin-left:auto;margin-right:auto;width:410px;background-color:white; background-color: salmon; color:white; padding: 20px; font-size: 1.3em; border-radius: 10px;");
    el.innerHTML = message;
    setTimeout(function() {
        el.parentNode.removeChild(el);
        button.style.visibility = "visible";
        scores.style.visibility = "visible";
    }, duration);
    document.getElementsByClassName("container")[0].appendChild(el);

}