document.addEventListener("DOMContentLoaded", function () {
    var gameBoardDiv = document.querySelector("#gameBoard");
    var restartButton = document.querySelector("#restartButton");
    // Define playerFactory
    var playerFactory = function (name, number, symbol, ownTurn) {
        return { name: name, number: number, symbol: symbol, ownTurn: ownTurn };
    };
    // Create two new players. playerOne goes first
    var playerOne = playerFactory("Alpha", 1, "X", true);
    var playerTwo = playerFactory("Omega", 2, "O", false);
    // Game Module to start game, reset game, toggle player turns, add marks, etc.
    var ticTacToeGame = (function () {
        var gameBoard = ["", "", "", "", "", "", "", "", ""];
        var initGameBoard = function () {
            for (var index in gameBoard) {
                var div = document.createElement("div");
                div.classList.add("divInsideBoard");
                div.textContent = "";
                div.id = index;
                div.addEventListener("click", addMark);
                gameBoardDiv.appendChild(div);
            }
        };
        var resetGame = function () {
            while (gameBoardDiv.firstChild) {
                gameBoardDiv.removeChild(gameBoardDiv.firstChild);
            }
            for (var index = 0; index < gameBoard.length; index++) {
                gameBoard[index] = "";
            }
            initGameBoard();
        };
        var toggleTurns = function () {
            playerOne.ownTurn ? playerOne.ownTurn = false : playerOne.ownTurn = true;
            playerTwo.ownTurn ? playerTwo.ownTurn = false : playerTwo.ownTurn = true;
        };
        var addMark = function (e) {
            var currentSquare = e.target.innerText;
            if (currentSquare === "") {
                if (playerOne.ownTurn && !playerTwo.ownTurn) {
                    e.target.textContent = playerOne.symbol;
                    gameBoard[e.target.id] = playerOne.symbol;
                    toggleTurns();
                }
                else if (!playerOne.ownTurn && playerTwo.ownTurn) {
                    e.target.textContent = playerTwo.symbol;
                    gameBoard[e.target.id] = playerTwo.symbol;
                    toggleTurns();
                }
            }
        };
        restartButton.addEventListener("click", resetGame);
        return {
            initGameBoard: initGameBoard,
            resetGame: resetGame,
            gameBoard: gameBoard
        };
    })();
    var checkForWinner = (function () {
        var winningCombination = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 3, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        winningCombination.forEach(function (winPossibility) {
        });
    });
    // Starts the Game By Populating the Gameboard
    ticTacToeGame.initGameBoard();
    // close 1st function
});
