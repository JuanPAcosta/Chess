const forfeitButton = document.getElementsByClassName("forfeit-button");
const turnCard = document.getElementsByClassName("turn-card");
const minutes = document.getElementsByClassName("minutes");
const seconds = document.getElementsByClassName("seconds");
var totalPieces = document.getElementsByClassName("piece");
var whitePiecesList = document.getElementsByClassName("white-piece");
var blackPiecesList = document.getElementsByClassName("black-piece");

var whiteTimer, blackTimer;
var whiteScore = [];
var blackScore = [];

for (let element of forfeitButton) {
    element.addEventListener("click", (event) => {
        let playerForfeit = event.target.classList[1];
        playerForfeit = playerForfeit.replace("forfeit-", "");
        gameOver(playerForfeit);
    });
}

for (let element of totalPieces) {
    element.addEventListener("dragstart", manageMove);
}

function manageMove() {
    var pieceMoved = this.classList[0];

    switch (pieceMoved) {
        case "w-pawn":
        case "b-pawn":
            movePawn(this);
            break;

        case "w-horse":
        case "b-horse":
            moveHorse(this);
            break;

        case "w-bishop":
        case "b-bishop":
            moveDiagonal(this);
            break;

        case "w-rook":
        case "b-rook":
            moveStraight(this);
            break;

        case "w-queen":
        case "b-queen":
            moveDiagonal(this);
            moveStraight(this);
            break;

        case "w-king":
        case "b-king":
            moveDiagonal(this);
            moveStraight(this);
            moveCastle(this);
            break;

        default:
            break;
    }
}

function movePawn(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentColumn = currentPiece.parentNode.id.charAt(0);
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var nextRow, pawnLimit, pawnFirstRow, pawnDoubleMove, piecesToEat;

    if (pieceName == "w-pawn") {
        nextRow = Number(currentRow) + 1;
        pawnLimit = 8;
        pawnFirstRow = 2;
        pawnDoubleMove = Number(nextRow) + 1;
        piecesToEat = "black-piece";
    } else if (pieceName == "b-pawn") {
        nextRow = Number(currentRow) - 1;
        pawnLimit = 1;
        pawnFirstRow = 7;
        pawnDoubleMove = Number(nextRow) - 1;
        piecesToEat = "white-piece";
    }

    if (Number(currentRow) != pawnLimit) {
        var positionsToEvaluate = [];
        var nextSquare = document.getElementById(`${currentColumn}${nextRow}`);

        if (nextSquare.childElementCount == 0) {
            positionsToEvaluate.push(nextSquare);
            if (currentRow == pawnFirstRow) {
                nextSquare = document.getElementById(`${currentColumn}${pawnDoubleMove}`);
                if (nextSquare.childElementCount == 0) {
                    positionsToEvaluate.push(nextSquare);
                }
            }
        }

        if (currentColumn != "A") {
            var leftColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            nextSquare = document.getElementById(`${leftColumn}${nextRow}`);

            if (nextSquare.childElementCount != 0 && nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        if (currentColumn != "H") {
            var rightColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            nextSquare = document.getElementById(`${rightColumn}${nextRow}`);
            if (nextSquare.childElementCount != 0 && nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        movePiece(positionsToEvaluate, currentPiece);
    }
}

function moveHorse(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentColumn = currentPiece.parentNode.id.charAt(0);
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var columnToEvaluate, rowToEvaluate, piecesToEat, nextSquare;
    var positionsToEvaluate = [];

    if (pieceName == "w-horse") {
        piecesToEat = "black-piece";
    } else if (pieceName == "b-horse") {
        piecesToEat = "white-piece";
    }

    if (Number(currentRow) <= 6) {
        rowToEvaluate = Number(currentRow) + 2;

        if (currentColumn != "A") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() - 1);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        if (currentColumn != "H") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() + 1);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }
    }

    if (Number(currentRow) >= 3) {
        rowToEvaluate = Number(currentRow) - 2;

        if (currentColumn != "A") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() - 1);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        if (currentColumn != "H") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() + 1);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }
    }

    if (Number(currentRow) != 1) {
        rowToEvaluate = Number(currentRow) - 1;

        if (currentColumn >= "C") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() - 2);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        if (currentColumn <= "F") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() + 2);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }
    }

    if (Number(currentRow) != 8) {
        rowToEvaluate = Number(currentRow) + 1;

        if (currentColumn >= "C") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() - 2);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        if (currentColumn <= "F") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() + 2);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }
    }

    if (positionsToEvaluate.length > 0) {
        movePiece(positionsToEvaluate, currentPiece);
    }
}

function moveDiagonal(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentColumn = currentPiece.parentNode.id.charAt(0);
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var piecesToEat, lastSquare, lastSquareColumn, lastSquareRow, kingColumn, kingRow, nextSquare;
    var positionsToEvaluate = [];

    if (pieceName == "w-bishop" || pieceName == "w-queen" || pieceName == "w-king") {
        piecesToEat = "black-piece";
    } else if (pieceName == "b-bishop" || pieceName == "b-queen" || pieceName == "b-king") {
        piecesToEat = "white-piece";
    }

    if (currentColumn != "A" && currentRow != 8) {
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            kingRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            lastSquare = recursiveDiagonal("topLeft", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() + 1);
                lastSquareRow = Number(lastSquareRow) - 1;
            }
        }
    }

    if (currentColumn != "H" && currentRow != 8) {
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            kingRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            lastSquare = recursiveDiagonal("topRight", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() - 1);
                lastSquareRow = Number(lastSquareRow) - 1;
            }
        }
    }

    if (currentColumn != "A" && currentRow != 1) {
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            kingRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            lastSquare = recursiveDiagonal("bottomLeft", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() + 1);
                lastSquareRow = Number(lastSquareRow) + 1;
            }
        }
    }

    if (currentColumn != "H" && currentRow != 1) {
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            kingRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            lastSquare = recursiveDiagonal("bottomRight", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() - 1);
                lastSquareRow = Number(lastSquareRow) + 1;
            }
        }
    }

    if (positionsToEvaluate.length > 0) {
        movePiece(positionsToEvaluate, currentPiece);
    }
}

function recursiveDiagonal(evaluateDiagonal, currentColumn, currentRow, piecesToEat) {
    var nextSquare;

    switch (evaluateDiagonal) {
        case "topLeft":
            if (currentColumn == "A" || currentRow == 8) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            currentRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            if (nextSquare.childElementCount != 0) {
                if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                    return nextSquare;
                } else {
                    currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
                    currentRow = Number(currentRow) - 1;
                    nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                    return nextSquare;
                }
            }

            break;

        case "topRight":
            if (currentColumn == "H" || currentRow == 8) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            currentRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            if (nextSquare.childElementCount != 0) {
                if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                    return nextSquare;
                } else {
                    currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
                    currentRow = Number(currentRow) - 1;
                    nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                    return nextSquare;
                }
            }
            break;

        case "bottomLeft":
            if (currentColumn == "A" || currentRow == 1) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            currentRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            if (nextSquare.childElementCount != 0) {
                if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                    return nextSquare;
                } else {
                    currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
                    currentRow = Number(currentRow) + 1;
                    nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                    return nextSquare;
                }
            }
            break;

        case "bottomRight":
            if (currentColumn == "H" || currentRow == 1) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            currentRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            if (nextSquare.childElementCount != 0) {
                if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                    return nextSquare;
                } else {
                    currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
                    currentRow = Number(currentRow) + 1;
                    nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                    return nextSquare;
                }
            }
            break;

        default:
            break;
    }

    return recursiveDiagonal(evaluateDiagonal, currentColumn, currentRow, piecesToEat);
}

function moveStraight(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentColumn = currentPiece.parentNode.id.charAt(0);
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var piecesToEat, lastSquare, lastSquareColumn, lastSquareRow, kingColumn, kingRow, nextSquare;
    var positionsToEvaluate = [];

    if (pieceName == "w-rook" || pieceName == "w-queen" || pieceName == "w-king") {
        piecesToEat = "black-piece";
    } else if (pieceName == "b-rook" || pieceName == "b-queen" || pieceName == "b-king") {
        piecesToEat = "white-piece";
    }

    if (currentColumn != "A") {
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            kingRow = Number(currentRow);
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            lastSquare = recursiveStraight("left", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() + 1);
                lastSquareRow = Number(lastSquareRow);
            }
        }
    }

    if (currentColumn != "H") {
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            kingRow = Number(currentRow);
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            lastSquare = recursiveStraight("right", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() - 1);
                lastSquareRow = Number(lastSquareRow);
            }
        }
    }

    if (Number(currentRow) != 8) {
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt());
            kingRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            lastSquare = recursiveStraight("top", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            while (lastSquareRow != currentRow) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt());
                lastSquareRow = Number(lastSquareRow) - 1;
            }
        }
    }

    if (Number(currentRow) != 1) {
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt());
            kingRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            lastSquare = recursiveStraight("bottom", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            while (lastSquareRow != currentRow) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt());
                lastSquareRow = Number(lastSquareRow) + 1;
            }
        }
    }

    if (positionsToEvaluate.length > 0) {
        movePiece(positionsToEvaluate, currentPiece);
    }
}

function recursiveStraight(evaluateStraight, currentColumn, currentRow, piecesToEat) {
    var nextSquare;

    switch (evaluateStraight) {
        case "left":
            if (currentColumn == "A") {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            currentRow = Number(currentRow);
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            if (nextSquare.childElementCount != 0) {
                if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                    return nextSquare;
                } else {
                    currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
                    currentRow = Number(currentRow);
                    nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                    return nextSquare;
                }
            }

            break;

        case "right":
            if (currentColumn == "H") {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            currentRow = Number(currentRow);
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            if (nextSquare.childElementCount != 0) {
                if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                    return nextSquare;
                } else {
                    currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
                    currentRow = Number(currentRow);
                    nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                    return nextSquare;
                }
            }

            break;

        case "top":
            if (Number(currentRow) == 8) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt());
            currentRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            if (nextSquare.childElementCount != 0) {
                if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                    return nextSquare;
                } else {
                    currentColumn = String.fromCharCode(currentColumn.charCodeAt());
                    currentRow = Number(currentRow) - 1;
                    nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                    return nextSquare;
                }
            }

            break;

        case "bottom":
            if (Number(currentRow) == 1) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt());
            currentRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            if (nextSquare.childElementCount != 0) {
                if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                    return nextSquare;
                } else {
                    currentColumn = String.fromCharCode(currentColumn.charCodeAt());
                    currentRow = Number(currentRow) + 1;
                    nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                    return nextSquare;
                }
            }

            break;

        default:
            break;
    }

    return recursiveStraight(evaluateStraight, currentColumn, currentRow, piecesToEat);
}

function moveCastle(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var firstSpace, secondSpace, thirdSpace, shortCastle, longCastle;
    var positionsToEvaluate = [];

    if (pieceName == "w-king") {
        shortCastle = document.getElementById("H1");
        longCastle = document.getElementById("A1");
        piecesToEat = "black-piece";
    } else if (pieceName == "b-king") {
        shortCastle = document.getElementById("H8");
        longCastle = document.getElementById("A8");
        piecesToEat = "white-piece";
    }

    if (currentPiece.classList.contains("castling")) {
        if (shortCastle.childElementCount != 0 && shortCastle.firstElementChild.classList.contains("castling")) {
            firstSpace = document.getElementById(`${"F"}${currentRow}`);
            secondSpace = document.getElementById(`${"G"}${currentRow}`);

            if (firstSpace.childElementCount == 0 && secondSpace.childElementCount == 0) {
                positionsToEvaluate.push(shortCastle);
            }
        }

        if (longCastle.childElementCount != 0 && longCastle.firstElementChild.classList.contains("castling")) {
            firstSpace = document.getElementById(`${"B"}${currentRow}`);
            secondSpace = document.getElementById(`${"C"}${currentRow}`);
            thirdSpace = document.getElementById(`${"D"}${currentRow}`);

            if (
                firstSpace.childElementCount == 0 &&
                secondSpace.childElementCount == 0 &&
                thirdSpace.childElementCount == 0
            ) {
                positionsToEvaluate.push(longCastle);
            }
        }
    }

    if (positionsToEvaluate.length > 0) {
        movePiece(positionsToEvaluate, currentPiece);
    }
}

function evaluateSpace(nextSquare, piecesToEat) {
    if (nextSquare.childElementCount == 0) {
        return true;
    } else if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
        return true;
    }
    return false;
}

function movePiece(posibleMoves, pieceMoved) {
    for (let element of posibleMoves) {
        element.classList.add("dropzone");
        pieceMoved.classList.add("moveAvailable");

        element.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        element.addEventListener("drop", (event) => {
            event.preventDefault();

            if (element.classList.contains("dropzone") && pieceMoved.classList.contains("moveAvailable")) {
                if (element.childElementCount == 0) {
                    pieceMoved.parentNode.removeChild(pieceMoved);
                    element.appendChild(pieceMoved);
                    registerMove(element, "move");
                } else if (pieceMoved.classList.contains("w-king") || pieceMoved.classList.contains("b-king")) {
                    if (
                        pieceMoved.classList.contains("castling") &&
                        element.firstElementChild.classList.contains("castling")
                    ) {
                        if (element.id.charAt(0) == "H") {
                            let currentRow = pieceMoved.parentNode.id.charAt(1);
                            var rookSquare = document.getElementById(`${"F"}${currentRow}`);
                            var kingSquare = document.getElementById(`${"G"}${currentRow}`);
                            var typeOfCastle = "shortCastle";
                        } else if (element.id.charAt(0) == "A") {
                            let currentRow = pieceMoved.parentNode.id.charAt(1);
                            var rookSquare = document.getElementById(`${"D"}${currentRow}`);
                            var kingSquare = document.getElementById(`${"C"}${currentRow}`);
                            var typeOfCastle = "longCastle";
                        }

                        registerMove(element, typeOfCastle);
                        rookSquare.appendChild(element.firstElementChild);
                        kingSquare.appendChild(pieceMoved);
                    } else {
                        let pieceToEat = element.firstElementChild;
                        manageScore(pieceToEat, false);
                        element.removeChild(pieceToEat);
                        pieceMoved.parentNode.removeChild(pieceMoved);
                        element.appendChild(pieceMoved);
                        registerMove(element, "eat");

                        if (pieceToEat.classList[0] == "w-king" || pieceToEat.classList[0] == "b-king") {
                            let loser = pieceToEat.classList[2];
                            loser = loser.replace("-piece", "");
                            console.log(loser);
                            gameOver(loser);
                        }
                    }
                } else {
                    let pieceToEat = element.firstElementChild;
                    manageScore(pieceToEat, false);
                    element.removeChild(pieceToEat);
                    pieceMoved.parentNode.removeChild(pieceMoved);
                    element.appendChild(pieceMoved);
                    registerMove(element, "eat");

                    if (pieceToEat.classList[0] == "w-king" || pieceToEat.classList[0] == "b-king") {
                        let loser = pieceToEat.classList[2];
                        loser = loser.replace("-piece", "");
                        gameOver(loser);
                    }
                }

                pieceMoved.classList.remove("castling");

                for (let element of posibleMoves) {
                    element.classList.remove("dropzone");
                }

                if (pieceMoved.classList.contains("w-pawn") || pieceMoved.classList.contains("b-pawn")) {
                    if (element.id.charAt(1) == 8 || element.id.charAt(1) == 1) {
                        let pieceToEat = element.firstElementChild;

                        if (pieceToEat.classList[0] != "w-king" || pieceToEat.classList[0] != "b-king") {
                            let pieceColor = element.firstElementChild.classList[0].charAt(0);
                            var newPiece = document.getElementsByClassName(`${pieceColor}${"-selection"}`);
                            var showSelection = document.getElementsByClassName("select-section");
                            showSelection[0].classList.remove("hidden");
                            newPiece[0].classList.remove("hidden");

                            let newPieceList = [];
                            newPieceList.push(document.getElementById(`${"new-"}${pieceColor}${"-queen"}`));
                            newPieceList.push(document.getElementById(`${"new-"}${pieceColor}${"-horse"}`));
                            newPieceList.push(document.getElementById(`${"new-"}${pieceColor}${"-rook"}`));
                            newPieceList.push(document.getElementById(`${"new-"}${pieceColor}${"-bishop"}`));

                            for (let piece of newPieceList) {
                                piece.addEventListener("click", (event) => {
                                    let cloneNewPiece;
                                    manageScore(element.firstElementChild, false);
                                    element.removeChild(element.firstElementChild);
                                    cloneNewPiece = piece.firstElementChild.cloneNode();
                                    element.appendChild(cloneNewPiece);
                                    manageScore(cloneNewPiece, true);

                                    showSelection[0].classList.add("hidden");
                                    newPiece[0].classList.add("hidden");

                                    totalPieces = document.getElementsByClassName("piece");
                                    whitePiecesList = document.getElementsByClassName("white-piece");
                                    blackPiecesList = document.getElementsByClassName("black-piece");

                                    for (let element of totalPieces) {
                                        element.addEventListener("dragstart", manageMove);
                                    }

                                    if (element.firstElementChild.classList.contains("black-piece")) {
                                        whiteTurn();
                                    } else if (element.firstElementChild.classList.contains("white-piece")) {
                                        blackTurn();
                                    }
                                });
                            }
                        }
                    } else {
                        if (pieceMoved.classList.contains("black-piece")) {
                            whiteTurn();
                        } else if (pieceMoved.classList.contains("white-piece")) {
                            blackTurn();
                        }
                    }
                } else {
                    if (pieceMoved.classList.contains("black-piece")) {
                        whiteTurn();
                    } else if (pieceMoved.classList.contains("white-piece")) {
                        blackTurn();
                    }
                }
            }
        });
    }

    pieceMoved.addEventListener("dragend", () => {
        for (let element of posibleMoves) {
            element.classList.remove("dropzone");
        }
        pieceMoved.classList.remove("moveAvailable");
    });
}

function manageScore(removedPiece, newPieceFlag) {
    let piece = removedPiece.classList[0];
    let colorEated = removedPiece.classList[2];
    let colorMoved;

    if (newPieceFlag == false) {
        if (colorEated == "white-piece") {
            colorMoved = "black";
            colorEated = "white";
        } else if (colorEated == "black-piece") {
            colorMoved = "white";
            colorEated = "black";
        }
    } else {
        if (colorEated == "black-piece") {
            colorMoved = "black";
            colorEated = "white";
        } else if (colorEated == "white-piece") {
            colorMoved = "white";
            colorEated = "black";
        }
    }

    switch (piece) {
        case "w-pawn":
        case "b-pawn":
            if (colorMoved == "white") {
                whiteScore.push(1);
                whiteScore.sort();
                calculateCurrentScore();
            } else {
                blackScore.push(1);
                blackScore.sort();
                calculateCurrentScore();
            }

            break;

        case "w-bishop":
        case "b-bishop":
            if (colorMoved == "white") {
                whiteScore.push(3);
                whiteScore.sort();
                calculateCurrentScore();
            } else {
                blackScore.push(3);
                blackScore.sort();
                calculateCurrentScore();
            }

            break;

        case "w-horse":
        case "b-horse":
            if (colorMoved == "white") {
                whiteScore.push(3.5);
                whiteScore.sort();
                calculateCurrentScore();
            } else {
                blackScore.push(3.5);
                blackScore.sort();
                calculateCurrentScore();
            }

            break;

        case "w-rook":
        case "b-rook":
            if (colorMoved == "white") {
                whiteScore.push(5);
                whiteScore.sort();
                calculateCurrentScore();
            } else {
                blackScore.push(5);
                blackScore.sort();
                calculateCurrentScore();
            }

            break;

        case "w-queen":
        case "b-queen":
            if (colorMoved == "white") {
                whiteScore.push(9);
                whiteScore.sort();
                calculateCurrentScore();
            } else {
                blackScore.push(9);
                blackScore.sort();
                calculateCurrentScore();
            }

            break;

        default:
            break;
    }
}

function calculateCurrentScore() {
    let currentWhiteScore = 0;
    let currentBlackScore = 0;
    let currentWhiteSum = document.getElementById("white-score").lastElementChild;
    let currentBlackSum = document.getElementById("black-score").lastElementChild;
    let currenWhitePieces = document.getElementById("white-score").firstElementChild;
    let currentBlackPieces = document.getElementById("black-score").firstElementChild;

    currenWhitePieces.innerHTML = "";
    currentBlackPieces.innerHTML = "";

    for (let i = 0; i < whiteScore.length; i++) {
        calculateEatenPieces(whiteScore[i], "white");
        currentWhiteScore = currentWhiteScore + Math.floor(whiteScore[i]);
    }

    for (let i = 0; i < blackScore.length; i++) {
        calculateEatenPieces(blackScore[i], "black");
        currentBlackScore = currentBlackScore + Math.floor(blackScore[i]);
    }

    if (currentWhiteScore == currentBlackScore) {
        currentWhiteSum.innerHTML = "";
        currentBlackSum.innerHTML = "";
    } else if (currentWhiteScore > currentBlackScore) {
        currentWhiteSum.innerHTML = "+ " + (currentWhiteScore - currentBlackScore);
        currentBlackSum.innerHTML = "";
    } else if (currentBlackScore > currentWhiteScore) {
        currentBlackSum.innerHTML = "+ " + (currentBlackScore - currentWhiteScore);
        currentWhiteSum.innerHTML = "";
    }
}

function calculateEatenPieces(piecesEatenKey, colorMoved) {
    let scoreToModify = document.getElementById(`${colorMoved}${"-score"}`).firstElementChild;

    switch (piecesEatenKey) {
        case 1:
            if (colorMoved == "white") {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x2659";
            } else {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x265f";
            }

            break;

        case 3:
            if (colorMoved == "white") {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x2657";
            } else {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x265d";
            }
            break;

        case 3.5:
            if (colorMoved == "white") {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x2658";
            } else {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x265e";
            }
            break;

        case 5:
            if (colorMoved == "white") {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x2656";
            } else {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x265c";
            }
            break;

        case 9:
            if (colorMoved == "white") {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x2655";
            } else {
                scoreToModify.innerHTML = scoreToModify.innerHTML + "&#x265b";
            }
            break;

        default:
            break;
    }
}

//*window.scrollTo(0, document.body.scrollHeight);
function registerMove(target, typeOfMove) {
    let pieceMoved = target.firstElementChild.classList[0];
    let colorMoved = target.firstElementChild.classList[2];
    let targetSquare = target.id.toLowerCase();
    let turnTable = document.getElementsByClassName("current-moves");

    if (turnTable[0].childElementCount == 0) {
        createNewRow();
    }

    let lastRow = turnTable[0].lastElementChild;
    let lastTurn = lastRow.firstElementChild.innerHTML;
    lastTurn = Number(lastTurn.replace(".", ""));
    lastRow.classList.remove("hidden");

    let whiteMoves = document.getElementById(`${lastTurn}${".-w"}`);
    let blackMoves = document.getElementById(`${lastTurn}${".-b"}`);

    let moveString = "";
    moveString = createStringMovement(pieceMoved, targetSquare);

    switch (typeOfMove) {
        case "move":
            if (colorMoved == "white-piece") {
                whiteMoves.innerHTML = moveString;
            } else {
                blackMoves.innerHTML = moveString;
                createNewRow();
            }
            break;

        case "eat":
            let changeOnString = moveString.slice(moveString.length - 2);
            changeOnString = moveString.replace(changeOnString, "x" + changeOnString);

            if (colorMoved == "white-piece") {
                whiteMoves.innerHTML = changeOnString;
            } else {
                blackMoves.innerHTML = changeOnString;
                createNewRow();
            }
            break;

        case "shortCastle":
            if (colorMoved == "white-piece") {
                whiteMoves.innerHTML = "O-O";
            } else {
                blackMoves.innerHTML = "O-O";
                createNewRow();
            }
            break;

        case "longCastle":
            if (colorMoved == "white-piece") {
                whiteMoves.innerHTML = "O-O-O";
            } else {
                blackMoves.innerHTML = "O-O-O";
                createNewRow();
            }
            break;

        default:
            break;
    }

    turnTable[0].scrollTo(0, turnTable[0].scrollHeight);
}

function createNewRow() {
    let turnTable = document.getElementsByClassName("current-moves");

    if (turnTable[0].childElementCount != 0) {
        let lastRow = turnTable[0].lastElementChild;
        let lastTurn = lastRow.firstElementChild.innerHTML;
        lastTurn = Number(lastTurn.replace(".", ""));

        let newRow = document.createElement("div");
        let newTurn = document.createElement("span");
        let newWhiteMove = document.createElement("div");
        let newBlackMove = document.createElement("div");

        if (lastRow.classList.contains("dark-row")) {
            newRow.classList.add("moves-row", "light-row", "hidden");
        } else {
            newRow.classList.add("moves-row", "dark-row", "hidden");
        }

        newTurn.innerHTML = lastTurn + 1 + ".";
        newWhiteMove.classList.add("moves-table");
        newWhiteMove.setAttribute("id", newTurn.innerHTML + "-w");
        newBlackMove.classList.add("moves-table");
        newBlackMove.setAttribute("id", newTurn.innerHTML + "-b");

        newRow.appendChild(newTurn);
        newRow.appendChild(newWhiteMove);
        newRow.appendChild(newBlackMove);
        turnTable[0].appendChild(newRow);
    } else {
        let newRow = document.createElement("div");
        let newTurn = document.createElement("span");
        let newWhiteMove = document.createElement("div");
        let newBlackMove = document.createElement("div");

        newRow.classList.add("moves-row", "dark-row", "hidden");
        newTurn.innerHTML = "1.";
        newWhiteMove.classList.add("moves-table");
        newWhiteMove.setAttribute("id", newTurn.innerHTML + "-w");
        newBlackMove.classList.add("moves-table");
        newBlackMove.setAttribute("id", newTurn.innerHTML + "-b");

        newRow.appendChild(newTurn);
        newRow.appendChild(newWhiteMove);
        newRow.appendChild(newBlackMove);
        turnTable[0].appendChild(newRow);
    }
}

function createStringMovement(pieceName, moveMade) {
    var moveString = "";

    switch (pieceName) {
        case "w-pawn":
        case "b-pawn":
            if (pieceName.charAt(0) == "w") {
                moveString = "&#x265f" + " " + moveMade;
            } else {
                moveString = "&#x2659" + " " + moveMade;
            }
            break;

        case "w-bishop":
        case "b-bishop":
            if (pieceName.charAt(0) == "w") {
                moveString = "&#x265d" + " " + moveMade;
            } else {
                moveString = "&#x2657" + " " + moveMade;
            }
            break;

        case "w-horse":
        case "b-horse":
            if (pieceName.charAt(0) == "w") {
                moveString = "&#x265e" + " " + moveMade;
            } else {
                moveString = "&#x2658" + " " + moveMade;
            }
            break;

        case "w-rook":
        case "b-rook":
            if (pieceName.charAt(0) == "w") {
                moveString = "&#x265c" + " " + moveMade;
            } else {
                moveString = "&#x2656" + " " + moveMade;
            }
            break;

        case "w-queen":
        case "b-queen":
            if (pieceName.charAt(0) == "w") {
                moveString = "&#x265b" + " " + moveMade;
            } else {
                moveString = "&#x2655" + " " + moveMade;
            }
            break;

        case "w-king":
        case "b-king":
            if (pieceName.charAt(0) == "w") {
                moveString = "&#x265a" + " " + moveMade;
            } else {
                moveString = "&#x2654" + " " + moveMade;
            }
            break;

        default:
            break;
    }

    return moveString;
}

function whiteTurn() {
    manageTurnClasses("white");
    countdown("white", seconds[1], minutes[1]);
}

function blackTurn() {
    manageTurnClasses("black");
    countdown("black", seconds[0], minutes[0]);
}

function manageTurnClasses(turn) {
    if (turn == "black") {
        clearInterval(whiteTimer);
        turnCard[1].classList.remove("white-turn");
        turnCard[0].classList.add("black-turn");

        for (let element of blackPiecesList) {
            element.classList.add("black-turn");
        }

        for (let element of whitePiecesList) {
            element.classList.remove("white-turn");
        }
    } else if (turn == "white") {
        clearInterval(blackTimer);
        turnCard[0].classList.remove("black-turn");
        turnCard[1].classList.add("white-turn");

        for (let element of whitePiecesList) {
            element.classList.add("white-turn");
            element.setAttribute("draggable", true);
        }

        for (let element of blackPiecesList) {
            element.classList.remove("black-turn");
        }
    }
}

function countdown(selector, secsLeft, minsLeft) {
    var mins = minsLeft;
    var secs = secsLeft;

    if (secs.innerHTML != 0 || mins.innerHTML != 0) {
        var timer = setInterval(() => {
            if (secs.innerHTML == 0) {
                if (mins.innerHTML > 0) {
                    mins.innerHTML = mins.innerHTML - 1;
                    secs.innerHTML = 60;
                }
            }

            if (secs.innerHTML <= 10) {
                secs.innerHTML = "0" + (secs.innerHTML - 1).toString();
            } else {
                secs.innerHTML = secs.innerHTML - 1;
            }

            if (secs.innerHTML == 0 && mins.innerHTML == 0) {
                gameOver(selector);
                clearInterval(timer);
            }
        }, 1000);

        if (selector == "black") {
            blackTimer = timer;
        } else {
            whiteTimer = timer;
        }
    }
}

function gameOver(loser) {
    let gameOver = document.getElementsByClassName("game-over-section");
    gameOver[0].classList.remove("hidden");
    clearInterval(whiteTimer);
    clearInterval(blackTimer);

    if (loser == "black") {
        let winner = document.getElementById("white-wins");
        winner.classList.remove("hidden");
        seconds[0].innerHTML = "00";
        minutes[0].innerHTML = "0";
    } else {
        let winner = document.getElementById("black-wins");
        winner.classList.remove("hidden");
        seconds[1].innerHTML = "00";
        minutes[1].innerHTML = "0";
    }
}

const recolorPiece = document.getElementsByClassName("recolor");
const recolorBoard = document.getElementsByClassName("recolor-board");

for (let element of recolorPiece) {
    element.addEventListener("click", (event) => {
        let totalPieces = document.getElementsByClassName("piece");

        for (let element of totalPieces) {
            let pieceName = element.classList[0];
            let newSrc = "./src/Assets/Images/" + event.target.classList[1] + "-" + pieceName + ".png";
            element.setAttribute("src", newSrc);
        }
    });
}

for (let element of recolorBoard) {
    element.addEventListener("click", (event) => {
        let blackSquares = document.getElementsByClassName("black-square");
        let whiteSquares = document.getElementsByClassName("white-square");

        let newBlackColor = event.target.firstElementChild.classList[1];
        let newWhiteColor = event.target.lastElementChild.classList[1];
        let currentDarkColor = blackSquares[0].classList[1];
        let currentLightColor = whiteSquares[0].classList[1];

        for (let element of blackSquares) {
            element.classList.replace(currentDarkColor, newBlackColor);
        }

        for (let element of whiteSquares) {
            element.classList.replace(currentLightColor, newWhiteColor);
        }
    });
}
