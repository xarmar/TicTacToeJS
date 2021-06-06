document.addEventListener("DOMContentLoaded", function () {
    var gameBoardDiv = document.querySelector("#gameBoard");
    var restartButton = document.querySelector("#restartButton");
    var gameHasEnded;
    // playerModule - playerFactory, toggleTurns
    var playerModule = (function () {
        var playerFactory = function (name, number, symbol, ownTurn) {
            return { name: name, number: number, symbol: symbol, ownTurn: ownTurn };
        };
        // toggles who's turn it is: Player1 or Player 2.
        var toggleTurns = function () {
            playerOne.ownTurn ? playerOne.ownTurn = false : playerOne.ownTurn = true;
            playerTwo.ownTurn ? playerTwo.ownTurn = false : playerTwo.ownTurn = true;
        };
        return {
            playerFactory: playerFactory,
            toggleTurns: toggleTurns
        };
    })();
    // gameBoardModule - sets gameboard, starts game(populates DOM), adds player marks, etc.
    var gameBoardModule = (function () {
        var gameBoard = ["", "", "", "", "", "", "", "", ""];
        // gets current gameBoard
        var getGameBoard = function () {
            return gameBoard;
        };
        // sets gameBoard with a specific symbol
        var setSymbolForGameBoardIndex = function (index, symbol) {
            gameBoard[index] = symbol;
        };
        // populate gameBoard with 9 empty divs.
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
        // Adds player's symbol to clicked div.
        var addMark = function (e) {
            if (!gameHasEnded) {
                var clickedSquareText = e.target.innerText;
                var clickedSquareIndex = e.target.id;
                if (clickedSquareText === "") {
                    if (playerOne.ownTurn && !playerTwo.ownTurn) {
                        e.target.textContent = playerOne.symbol;
                        setSymbolForGameBoardIndex(clickedSquareIndex, playerOne.symbol);
                        playerModule.toggleTurns();
                        gameModule.checkForWinner();
                        gameModule.checkForDraw();
                    }
                    else if (!playerOne.ownTurn && playerTwo.ownTurn) {
                        e.target.textContent = playerTwo.symbol;
                        setSymbolForGameBoardIndex(clickedSquareIndex, playerTwo.symbol);
                        playerModule.toggleTurns();
                        gameModule.checkForWinner();
                        gameModule.checkForDraw();
                    }
                }
            }
        };
        return {
            gameBoard: gameBoard,
            initGameBoard: initGameBoard,
            getGameBoard: getGameBoard,
            setSymbolForGameBoardIndex: setSymbolForGameBoardIndex
        };
    })();
    // gameModule - tracks winners, draws and resets game.
    var gameModule = (function () {
        var gameBoard = gameBoardModule.getGameBoard();
        // resetGame: remove the child elements of gameBoard from DOM, and run initGameBoard.
        var resetGame = function () {
            while (gameBoardDiv.firstChild) {
                gameBoardDiv.removeChild(gameBoardDiv.firstChild);
            }
            for (var index = 0; index < gameBoard.length; index++) {
                gameBoardModule.setSymbolForGameBoardIndex(index, "");
            }
            gameHasEnded = false;
            playerOne.ownTurn = true;
            playerTwo.ownTurn = false;
            gameBoardModule.initGameBoard();
        };
        // winner gameController
        var winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        var checkForWinner = function () {
            if (!gameHasEnded) {
                winningCombinations.forEach(function (winPossibility) {
                    var symbols = [];
                    winPossibility.forEach(function (index) {
                        symbols.push(gameBoard[index]);
                    });
                    if (symbols.toString() === "X,X,X") {
                        alert("The Winner is " + playerOne.name);
                        gameHasEnded = true;
                    }
                    else if (symbols.toString() === "O,O,O") {
                        alert("The Winner is " + playerTwo.name);
                        gameHasEnded = true;
                    }
                });
            }
            ;
        };
        var checkForDraw = function () {
            var markedDivs = 0;
            for (var i = 0; i < gameBoard.length; i++) {
                if (gameBoard[i] !== "") {
                    markedDivs++;
                }
            }
            if (markedDivs === gameBoard.length) {
                alert("It's a draw!");
            }
        };
        return {
            resetGame: resetGame,
            checkForWinner: checkForWinner,
            checkForDraw: checkForDraw
        };
    })();
    // Create two new players. playerOne goes first
    var playerOne = playerModule.playerFactory("Alpha", 1, "X", true);
    var playerTwo = playerModule.playerFactory("Omega", 2, "O", false);
    // Starts the Game By Populating the Gameboard
    gameBoardModule.initGameBoard();
    // Listen for clicks to restart Game
    restartButton.addEventListener("click", gameModule.resetGame);
});
