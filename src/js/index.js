//Call all the variables that we are going to use
const forfeitButton = document.getElementsByClassName("forfeit-button");
const turnCard = document.getElementsByClassName("turn-card");
const minutes = document.getElementsByClassName("minutes");
const seconds = document.getElementsByClassName("seconds");
var totalPieces = document.getElementsByClassName("piece");
var whitePiecesList = document.getElementsByClassName("white-piece");
var blackPiecesList = document.getElementsByClassName("black-piece");

//Define variables for the timers and the pieces that each player has eaten
var whiteTimer, blackTimer;
var whiteScore = [];
var blackScore = [];

//Asign the event to each botton to end the game if they forfeit
for (let element of forfeitButton) {
    element.addEventListener("click", (event) => {
        let playerForfeit = event.target.classList[1];
        playerForfeit = playerForfeit.replace("forfeit-", "");
        gameOver(playerForfeit);
    });
}

//Start the cicle to find the posible moves with the piece that is being dragged
for (let element of totalPieces) {
    element.addEventListener("dragstart", manageMove);
}

//Manage the type of move depending on the piece (pawn/horse/bishop ...)
function manageMove() {
    var pieceMoved = this.classList[0];

    switch (pieceMoved) {
        case "w-pawn":
        case "b-pawn":
            //Moves forward and eat diagonal
            movePawn(this);
            break;

        case "w-horse":
        case "b-horse":
            //Moves on L shape
            moveHorse(this);
            break;

        case "w-bishop":
        case "b-bishop":
            //Moves diagonal
            moveDiagonal(this);
            break;

        case "w-rook":
        case "b-rook":
            //Moves Left-Right-Top-Bottom
            moveStraight(this);
            break;

        case "w-queen":
        case "b-queen":
            //Moves diagonal and Left-Right-Top-Bottom
            moveDiagonal(this);
            moveStraight(this);
            break;

        case "w-king":
        case "b-king":
            //Moves diagonal and Left-Right-Top-Bottom and checks if castle is possible
            moveDiagonal(this);
            moveStraight(this);
            moveCastle(this);
            break;

        default:
            break;
    }
}

//Define the move for any Pawn on the board
function movePawn(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentColumn = currentPiece.parentNode.id.charAt(0);
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var nextRow, pawnLimit, pawnFirstRow, pawnDoubleMove, piecesToEat;

    //Define the enemy pieces and the constants to evaluate the possible moves
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

    //Evaluate the move for the pawn if the pawn is not on the end of the board
    if (Number(currentRow) != pawnLimit) {
        var positionsToEvaluate = [];
        var nextSquare = document.getElementById(`${currentColumn}${nextRow}`);

        //Evaluates the move forward if the next square is empty
        if (nextSquare.childElementCount == 0) {
            positionsToEvaluate.push(nextSquare);
            //Evaluate double move if is the first move of the pawn
            if (currentRow == pawnFirstRow) {
                nextSquare = document.getElementById(`${currentColumn}${pawnDoubleMove}`);
                if (nextSquare.childElementCount == 0) {
                    positionsToEvaluate.push(nextSquare);
                }
            }
        }

        //Evaluate the eating move if theres an enemy on the diagonal Top-Left / Bottom-Left (for blacks)
        if (currentColumn != "A") {
            var leftColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            nextSquare = document.getElementById(`${leftColumn}${nextRow}`);

            if (nextSquare.childElementCount != 0 && nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        //Evaluate the eating move if theres an enemy on the diagonal Top-Right / Bottom-Left (for blacks)
        if (currentColumn != "H") {
            var rightColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            nextSquare = document.getElementById(`${rightColumn}${nextRow}`);
            if (nextSquare.childElementCount != 0 && nextSquare.firstElementChild.classList.contains(piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        //Send the possible moves to enable them
        movePiece(positionsToEvaluate, currentPiece);
    }
}

//Define the move for any Horse on the board
function moveHorse(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentColumn = currentPiece.parentNode.id.charAt(0);
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var columnToEvaluate, rowToEvaluate, piecesToEat, nextSquare;
    var positionsToEvaluate = [];

    //Define the enemy pieces
    if (pieceName == "w-horse") {
        piecesToEat = "black-piece";
    } else if (pieceName == "b-horse") {
        piecesToEat = "white-piece";
    }

    //Evaluate the L shape move on directions Top-Left / Top-Right
    if (Number(currentRow) <= 6) {
        rowToEvaluate = Number(currentRow) + 2;

        //Top-Left
        if (currentColumn != "A") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() - 1);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        //Top-Right
        if (currentColumn != "H") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() + 1);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }
    }

    //Evaluate the L shape move on directions Bottom-Left / Bottom-Right
    if (Number(currentRow) >= 3) {
        rowToEvaluate = Number(currentRow) - 2;

        //Bottom-Left
        if (currentColumn != "A") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() - 1);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        //Bottom-Right
        if (currentColumn != "H") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() + 1);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }
    }

    //Evaluate the L shape move on directions Left-Bottom / Right-Bottom
    if (Number(currentRow) != 1) {
        rowToEvaluate = Number(currentRow) - 1;

        //Left-Bottom
        if (currentColumn >= "C") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() - 2);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        //Right-Bottom
        if (currentColumn <= "F") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() + 2);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }
    }

    //Evaluate the L shape move on directions Left-Top / Right-Top
    if (Number(currentRow) != 8) {
        rowToEvaluate = Number(currentRow) + 1;

        //Left-Top
        if (currentColumn >= "C") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() - 2);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }

        //Right-Top
        if (currentColumn <= "F") {
            columnToEvaluate = String.fromCharCode(currentColumn.charCodeAt() + 2);
            nextSquare = document.getElementById(`${columnToEvaluate}${rowToEvaluate}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        }
    }

    //Send the possible moves to enable them
    if (positionsToEvaluate.length > 0) {
        movePiece(positionsToEvaluate, currentPiece);
    }
}

//Define the move for any Bishop - Queen/diagonal - King/diagonal on the board
function moveDiagonal(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentColumn = currentPiece.parentNode.id.charAt(0);
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var piecesToEat, lastSquare, lastSquareColumn, lastSquareRow, kingColumn, kingRow, nextSquare;
    var positionsToEvaluate = [];

    //Define the enemy pieces
    if (pieceName == "w-bishop" || pieceName == "w-queen" || pieceName == "w-king") {
        piecesToEat = "black-piece";
    } else if (pieceName == "b-bishop" || pieceName == "b-queen" || pieceName == "b-king") {
        piecesToEat = "white-piece";
    }

    //Evaluate the diagonal move on directions Top-Left
    if (currentColumn != "A" && currentRow != 8) {
        //Evaluate the diagonal move for the King for next adjacent square
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            kingRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            //Evaluate the diagonal move for the Bishop/Queen for all the adjacent squares
            lastSquare = recursiveDiagonal("topLeft", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            //Adds all the posible squares to the posible moves (Top-Left)
            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() + 1);
                lastSquareRow = Number(lastSquareRow) - 1;
            }
        }
    }

    //Evaluate the diagonal move on directions Top-Right
    if (currentColumn != "H" && currentRow != 8) {
        //Evaluate the diagonal move for the King for next adjacent square
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            kingRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            //Evaluate the diagonal move for the Bishop/Queen for all the adjacent squares
            lastSquare = recursiveDiagonal("topRight", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            //Adds all the posible squares to the posible moves (Top-Right)
            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() - 1);
                lastSquareRow = Number(lastSquareRow) - 1;
            }
        }
    }

    //Evaluate the diagonal move on directions Bottom-Left
    if (currentColumn != "A" && currentRow != 1) {
        //Evaluate the diagonal move for the King for next adjacent square
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            kingRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            //Evaluate the diagonal move for the Bishop/Queen for all the adjacent squares
            lastSquare = recursiveDiagonal("bottomLeft", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            //Adds all the posible squares to the posible moves (Bottom-Left)
            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() + 1);
                lastSquareRow = Number(lastSquareRow) + 1;
            }
        }
    }

    //Evaluate the diagonal move on directions Bottom-Right
    if (currentColumn != "H" && currentRow != 1) {
        //Evaluate the diagonal move for the King for next adjacent square
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            kingRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            //Evaluate the diagonal move for the Bishop/Queen for all the adjacent squares
            lastSquare = recursiveDiagonal("bottomRight", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            //Adds all the posible squares to the posible moves (Bottom-Right)
            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() - 1);
                lastSquareRow = Number(lastSquareRow) + 1;
            }
        }
    }

    //Send the possible moves to enable them
    if (positionsToEvaluate.length > 0) {
        movePiece(positionsToEvaluate, currentPiece);
    }
}

//Recursive function to keep evaluating the diagonal and stop if he finds a piece
function recursiveDiagonal(evaluateDiagonal, currentColumn, currentRow, piecesToEat) {
    var nextSquare;

    //Evaluates each diagonal posible (Top-Left / Top-Right / Bottom-Left / Bottom-Right)
    switch (evaluateDiagonal) {
        case "topLeft":
            //If the function is on the left border || top border (Stops Top-Left evaluation)
            if (currentColumn == "A" || currentRow == 8) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            currentRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            //Returns the last square if it finds a piece
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
            //If the function is on the right border || top border (Stops Top-Right evaluation)
            if (currentColumn == "H" || currentRow == 8) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            currentRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            //Returns the last square if it finds a piece
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
            //If the function is on the left border || bottom border (Stops Bottom-Left evaluation)
            if (currentColumn == "A" || currentRow == 1) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            currentRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            //Returns the last square if it finds a piece
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
            //If the function is on the right border || bottom border (Stops Bottom-Right evaluation)
            if (currentColumn == "H" || currentRow == 1) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            currentRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            //Returns the last square if it finds a piece
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

    //Keeps evaluating diagonal until it finds a piece or the border of the board
    return recursiveDiagonal(evaluateDiagonal, currentColumn, currentRow, piecesToEat);
}

//Define the move for any Rook - Queen/straight - King/straight on the board
function moveStraight(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentColumn = currentPiece.parentNode.id.charAt(0);
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var piecesToEat, lastSquare, lastSquareColumn, lastSquareRow, kingColumn, kingRow, nextSquare;
    var positionsToEvaluate = [];

    //Define the enemy pieces
    if (pieceName == "w-rook" || pieceName == "w-queen" || pieceName == "w-king") {
        piecesToEat = "black-piece";
    } else if (pieceName == "b-rook" || pieceName == "b-queen" || pieceName == "b-king") {
        piecesToEat = "white-piece";
    }

    //Evaluate the straight move on direction Left
    if (currentColumn != "A") {
        //Evaluate the straight move for the King for next adjacent square
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            kingRow = Number(currentRow);
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            //Evaluate the straight move for the Rook/Queen for all the adjacent squares
            lastSquare = recursiveStraight("left", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            //Adds all the posible squares to the posible moves (Left)
            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() + 1);
                lastSquareRow = Number(lastSquareRow);
            }
        }
    }

    //Evaluate the straight move on direction Right
    if (currentColumn != "H") {
        //Evaluate the straight move for the King for next adjacent square
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            kingRow = Number(currentRow);
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            //Evaluate the straight move for the Rook/Queen for all the adjacent squares
            lastSquare = recursiveStraight("right", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            //Adds all the posible squares to the posible moves (Right)
            while (lastSquareColumn != currentColumn) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt() - 1);
                lastSquareRow = Number(lastSquareRow);
            }
        }
    }

    //Evaluate the straight move on direction Top
    if (Number(currentRow) != 8) {
        //Evaluate the straight move for the King for next adjacent square
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt());
            kingRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            //Evaluate the straight move for the Rook/Queen for all the adjacent squares
            lastSquare = recursiveStraight("top", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            //Adds all the posible squares to the posible moves (Top)
            while (lastSquareRow != currentRow) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt());
                lastSquareRow = Number(lastSquareRow) - 1;
            }
        }
    }

    //Evaluate the straight move on direction Bottom
    if (Number(currentRow) != 1) {
        //Evaluate the straight move for the King for next adjacent square
        if (pieceName == "w-king" || pieceName == "b-king") {
            kingColumn = String.fromCharCode(currentColumn.charCodeAt());
            kingRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${kingColumn}${kingRow}`);

            if (evaluateSpace(nextSquare, piecesToEat)) {
                positionsToEvaluate.push(nextSquare);
            }
        } else {
            //Evaluate the straight move for the Rook/Queen for all the adjacent squares
            lastSquare = recursiveStraight("bottom", currentColumn, currentRow, piecesToEat);
            lastSquareColumn = lastSquare.id.charAt(0);
            lastSquareRow = lastSquare.id.charAt(1);

            //Adds all the posible squares to the posible moves (Top)
            while (lastSquareRow != currentRow) {
                positionsToEvaluate.push(document.getElementById(`${lastSquareColumn}${lastSquareRow}`));
                lastSquareColumn = String.fromCharCode(lastSquareColumn.charCodeAt());
                lastSquareRow = Number(lastSquareRow) + 1;
            }
        }
    }

    //Send the possible moves to enable them
    if (positionsToEvaluate.length > 0) {
        movePiece(positionsToEvaluate, currentPiece);
    }
}

//Recursive function to keep evaluating the straight move and stop if he finds a piece
function recursiveStraight(evaluateStraight, currentColumn, currentRow, piecesToEat) {
    var nextSquare;

    //Evaluates each straight line posible (Left / Right / Top / Bottom)
    switch (evaluateStraight) {
        case "left":
            //If the function is on the left border (Stops Left evaluation)
            if (currentColumn == "A") {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() - 1);
            currentRow = Number(currentRow);
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            //Returns the last square if it finds a piece
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
            //If the function is on the right border (Stops Right evaluation)
            if (currentColumn == "H") {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt() + 1);
            currentRow = Number(currentRow);
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            //Returns the last square if it finds a piece
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
            //If the function is on the top border (Stops Top evaluation)
            if (Number(currentRow) == 8) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt());
            currentRow = Number(currentRow) + 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            //Returns the last square if it finds a piece
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
            //If the function is on the bottom border (Stops Bottom evaluation)
            if (Number(currentRow) == 1) {
                nextSquare = document.getElementById(`${currentColumn}${currentRow}`);
                return nextSquare;
            }

            currentColumn = String.fromCharCode(currentColumn.charCodeAt());
            currentRow = Number(currentRow) - 1;
            nextSquare = document.getElementById(`${currentColumn}${currentRow}`);

            //Returns the last square if it finds a piece
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

    //Keeps evaluating straight lines until it finds a piece or the border of the board
    return recursiveStraight(evaluateStraight, currentColumn, currentRow, piecesToEat);
}

//Define the move for Castle if its still possible in the game (King -> Rook)
function moveCastle(currentPiece) {
    var pieceName = currentPiece.classList[0];
    var currentRow = currentPiece.parentNode.id.charAt(1);
    var firstSpace, secondSpace, thirdSpace, shortCastle, longCastle;
    var positionsToEvaluate = [];

    //Define enemy pieces
    if (pieceName == "w-king") {
        shortCastle = document.getElementById("H1");
        longCastle = document.getElementById("A1");
        piecesToEat = "black-piece";
    } else if (pieceName == "b-king") {
        shortCastle = document.getElementById("H8");
        longCastle = document.getElementById("A8");
        piecesToEat = "white-piece";
    }

    //Evaluate if is possible to Short castle or Long castle
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

    //Send the possible moves to enable them
    if (positionsToEvaluate.length > 0) {
        movePiece(positionsToEvaluate, currentPiece);
    }
}

//Evaluate if the next square is empty or determine if the piece found is enemy or ally
function evaluateSpace(nextSquare, piecesToEat) {
    if (nextSquare.childElementCount == 0) {
        return true;
    } else if (nextSquare.firstElementChild.classList.contains(piecesToEat)) {
        return true;
    }
    return false;
}

//Enables the squares with the possible moves to be able to drop the piece moved
function movePiece(posibleMoves, pieceMoved) {
    for (let element of posibleMoves) {
        element.classList.add("dropzone");
        pieceMoved.classList.add("moveAvailable");

        //Default event to enable drop event
        element.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        //Enable every square required to drop
        element.addEventListener("drop", (event) => {
            event.preventDefault();

            if (element.classList.contains("dropzone") && pieceMoved.classList.contains("moveAvailable")) {
                //Moves the piece if the square selected is empty
                if (element.childElementCount == 0) {
                    pieceMoved.parentNode.removeChild(pieceMoved);
                    element.appendChild(pieceMoved);
                    registerMove(element, "move");
                } else if (pieceMoved.classList.contains("w-king") || pieceMoved.classList.contains("b-king")) {
                    if (
                        pieceMoved.classList.contains("castling") &&
                        element.firstElementChild.classList.contains("castling")
                    ) {
                        //Moves the piece if the player is trying to short castle or long castle
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

                        //Register the move to show the last move on the screen
                        registerMove(element, typeOfCastle);
                        rookSquare.appendChild(element.firstElementChild);
                        kingSquare.appendChild(pieceMoved);
                    } else {
                        //Moves the piece, Eats with the King and register the move
                        let pieceToEat = element.firstElementChild;
                        manageScore(pieceToEat, false);
                        element.removeChild(pieceToEat);
                        pieceMoved.parentNode.removeChild(pieceMoved);
                        element.appendChild(pieceMoved);
                        registerMove(element, "eat");

                        //If the piece eaten was the enemy King / Triggers - Game is over
                        if (pieceToEat.classList[0] == "w-king" || pieceToEat.classList[0] == "b-king") {
                            let loser = pieceToEat.classList[2];
                            loser = loser.replace("-piece", "");
                            console.log(loser);
                            gameOver(loser);
                        }
                    }
                } else {
                    //Moves the piece, Eats with the piece moved (Pawn - Horse - Bishop - Rook - Queen) and register the move
                    let pieceToEat = element.firstElementChild;
                    manageScore(pieceToEat, false);
                    element.removeChild(pieceToEat);
                    pieceMoved.parentNode.removeChild(pieceMoved);
                    element.appendChild(pieceMoved);
                    registerMove(element, "eat");

                    //If the piece eaten was the enemy King / Triggers - Game is over
                    if (pieceToEat.classList[0] == "w-king" || pieceToEat.classList[0] == "b-king") {
                        let loser = pieceToEat.classList[2];
                        loser = loser.replace("-piece", "");
                        gameOver(loser);
                    }
                }

                //If the piece moved was the Rook or the King, removes the possibility of Castle move from that piece
                pieceMoved.classList.remove("castling");

                //Once the piece was moved disable all the squares to prepare for the next turn
                for (let element of posibleMoves) {
                    element.classList.remove("dropzone");
                }

                //If any pawn reaches the end of the board, allow to choose new Piece (Rook - Horse - Queen - Bishop)
                if (pieceMoved.classList.contains("w-pawn") || pieceMoved.classList.contains("b-pawn")) {
                    if (element.id.charAt(1) == 8 || element.id.charAt(1) == 1) {
                        let pieceToEat = element.firstElementChild;

                        //Show the section to choose the new piece
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

                            //Clone the piece to add it and replace it for the Pawn and manage the score
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

                                    //Rearrange the classes and the events for the new piece added
                                    totalPieces = document.getElementsByClassName("piece");
                                    whitePiecesList = document.getElementsByClassName("white-piece");
                                    blackPiecesList = document.getElementsByClassName("black-piece");

                                    for (let element of totalPieces) {
                                        element.addEventListener("dragstart", manageMove);
                                    }

                                    //Change turn after replacing the new piece
                                    if (element.firstElementChild.classList.contains("black-piece")) {
                                        whiteTurn();
                                    } else if (element.firstElementChild.classList.contains("white-piece")) {
                                        blackTurn();
                                    }
                                });
                            }
                        }
                    } else {
                        //Change turn if a Pawn was moved
                        if (pieceMoved.classList.contains("black-piece")) {
                            whiteTurn();
                        } else if (pieceMoved.classList.contains("white-piece")) {
                            blackTurn();
                        }
                    }
                } else {
                    //Change turn if a piece (Horse - Rook - Bishop - Queen - King) was moved
                    if (pieceMoved.classList.contains("black-piece")) {
                        whiteTurn();
                    } else if (pieceMoved.classList.contains("white-piece")) {
                        blackTurn();
                    }
                }
            }
        });
    }

    //Once the piece was moved disable all the squares to prepare for the next turn
    pieceMoved.addEventListener("dragend", () => {
        for (let element of posibleMoves) {
            element.classList.remove("dropzone");
        }
        pieceMoved.classList.remove("moveAvailable");
    });
}

//Manage the score of both sides with the pieces that were eaten each turn
function manageScore(removedPiece, newPieceFlag) {
    let piece = removedPiece.classList[0];
    let colorEated = removedPiece.classList[2];
    let colorMoved;

    //Determine if a new piece is being added to the board wich would change the score
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

    //Add the piece that was eated to the corresponding score
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

//Calculates the current Score of both sides and show who is winning at the moment
function calculateCurrentScore() {
    let currentWhiteScore = 0;
    let currentBlackScore = 0;
    let currentWhiteSum = document.getElementById("white-score").lastElementChild;
    let currentBlackSum = document.getElementById("black-score").lastElementChild;
    let currenWhitePieces = document.getElementById("white-score").firstElementChild;
    let currentBlackPieces = document.getElementById("black-score").firstElementChild;

    currenWhitePieces.innerHTML = "";
    currentBlackPieces.innerHTML = "";

    //Calculates the current Score for White
    for (let i = 0; i < whiteScore.length; i++) {
        calculateEatenPieces(whiteScore[i], "white");
        currentWhiteScore = currentWhiteScore + Math.floor(whiteScore[i]);
    }

    //Calculates the current Score for Black
    for (let i = 0; i < blackScore.length; i++) {
        calculateEatenPieces(blackScore[i], "black");
        currentBlackScore = currentBlackScore + Math.floor(blackScore[i]);
    }

    //Shows on the score board how much points of difference are
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

//Add a visual sign of the pieces that each player have eaten
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

//Register every move on the table to show the history of the moves on the game
function registerMove(target, typeOfMove) {
    let pieceMoved = target.firstElementChild.classList[0];
    let colorMoved = target.firstElementChild.classList[2];
    let targetSquare = target.id.toLowerCase();
    let turnTable = document.getElementsByClassName("current-moves");

    //Creates a new row on the table each turn (white and black played)
    if (turnTable[0].childElementCount == 0) {
        createNewRow();
    }

    let lastRow = turnTable[0].lastElementChild;
    let lastTurn = lastRow.firstElementChild.innerHTML;
    lastTurn = Number(lastTurn.replace(".", ""));
    lastRow.classList.remove("hidden");

    let whiteMoves = document.getElementById(`${lastTurn}${".-w"}`);
    let blackMoves = document.getElementById(`${lastTurn}${".-b"}`);

    //Creates the message to explaing in the table the moved made by each player
    let moveString = "";
    moveString = createStringMovement(pieceMoved, targetSquare);

    //Change the message depending on the type of the move (Move - Eat - Short castle - Long castle)
    switch (typeOfMove) {
        case "move":
            //Normal move of piece
            if (colorMoved == "white-piece") {
                whiteMoves.innerHTML = moveString;
            } else {
                blackMoves.innerHTML = moveString;
                createNewRow();
            }
            break;

        case "eat":
            //Normal move of piece + X that indicates a Eating move
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
            //Message changed to O-O wich indicates short castle
            if (colorMoved == "white-piece") {
                whiteMoves.innerHTML = "O-O";
            } else {
                blackMoves.innerHTML = "O-O";
                createNewRow();
            }
            break;

        case "longCastle":
            //Message changed to O-O-O wich indicates long castle
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

    //Maintains the scrollbar on the bottom to always show the last move on the table
    turnTable[0].scrollTo(0, turnTable[0].scrollHeight);
}

//Creates rows on the HTML to show each turn once both players moved
function createNewRow() {
    let turnTable = document.getElementsByClassName("current-moves");

    //Creates the first row on the table to start the registration
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
        //Creates a new row on the table to continue the registration
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

//Define the message that is going to be showed with the visual sign of the piece moved and the square
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

//Enables the turn for white
function whiteTurn() {
    manageTurnClasses("white");
    countdown("white", seconds[1], minutes[1]);
}

//Enables the turn for black
function blackTurn() {
    manageTurnClasses("black");
    countdown("black", seconds[0], minutes[0]);
}

//Manage the classes of the pieces and the Turn card for each player depending on the turn
function manageTurnClasses(turn) {
    if (turn == "black") {
        //Enables all black pieces to move / disable white pieces and Stops the white timer
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
        //Enables all white pieces to move / disable black pieces and Stops the black timer
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

//Enables the timer for each player depending on the current turn and ends the game if the timer reaches 0
function countdown(selector, secsLeft, minsLeft) {
    var mins = minsLeft;
    var secs = secsLeft;

    //Countdown minutes/seconds
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

            //If the timer reaches 0 / Triggers - Game is over
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

//Enable the message for the winner, disable all the pieces, and stop both of the timers - Game is over
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

//Section to recolor the pieces/board if the player click on any of the recolors on the bottom of the screen
const recolorPiece = document.getElementsByClassName("recolor");
const recolorBoard = document.getElementsByClassName("recolor-board");

//Recolor the pieces based on the choice of the player
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

//Recolor the board based on the choice of the player
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
