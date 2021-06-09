document.addEventListener("DOMContentLoaded", function () {
    var title = document.querySelector("h1");
    var gameBoardContainer = document.querySelector("#gameBoardContainer");
    var footer = document.querySelector("#footer");
    // init variables
    var gameHasEnded;
    var winnerFound = false;
    var playerOne;
    var playerTwo;
    // playerModule - playerFactory(), toggleTurns(), checks who's turn it is and check if nameUnderFifteenChar()
    var playerModule = (function () {
        var playerFactory = function (name, number, symbol, ownTurn) {
            return { name: name, number: number, symbol: symbol, ownTurn: ownTurn };
        };
        // creates players with the playerFactory
        var createPlayers = function (playerOneName, playerTwoName) {
            // if its just AI
            if (playerOneName && !playerTwoName) {
                playerOne = playerModule.playerFactory(playerOneName, 1, "X", true);
                playerTwo = playerModule.playerFactory("AI", 2, "O", false);
                gameModule.deleteElementById("pickNamesDiv");
                gameBoardModule.initGameBoardDiv();
                gameBoardModule.initGameBoard();
            }
            // if against human - create both players
            if (playerOneName && playerTwoName) {
                playerOne = playerModule.playerFactory(playerOneName, 1, "X", true);
                playerTwo = playerModule.playerFactory(playerTwoName, 2, "O", false);
                gameModule.deleteElementById("pickNamesDiv");
                gameBoardModule.initGameBoardDiv();
                gameBoardModule.initGameBoard();
            }
        };
        // toggles who's turn it is: Player1 or Player 2.
        var toggleTurns = function () {
            playerOne.ownTurn ? playerOne.ownTurn = false : playerOne.ownTurn = true;
            playerTwo.ownTurn ? playerTwo.ownTurn = false : playerTwo.ownTurn = true;
        };
        // checks who's turn it is: playerOne or PlayerTwo
        var isPlayerOneTurn = function () { return playerOne.ownTurn ? true : false; };
        var isPlayerTwoTurn = function () { return playerTwo.ownTurn ? true : false; };
        // checks if names typed are under 15 characters and not empty
        var nameUnderFifteenChar = function (name) {
            if (!name) {
                alert("Please fill in all inputs.");
                return;
            }
            if (name.length < 15) {
                return true;
            }
            alert("Names must be under 15 chars.");
            return false;
        };
        return {
            playerFactory: playerFactory,
            createPlayers: createPlayers,
            toggleTurns: toggleTurns,
            isPlayerOneTurn: isPlayerOneTurn,
            isPlayerTwoTurn: isPlayerTwoTurn,
            nameUnderFifteenChar: nameUnderFifteenChar
        };
    })();
    // gameBoardModule - getGameBoard(), setSymbolForGameBoardIndex(), initGameBoardDiv(), insertRestartButton(), initGameBoard(), addMark()
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
        // inserts new div "gameBoard" and calls insertRestartButton function
        var initGameBoardDiv = function () {
            var gameBoardDiv = document.createElement("div");
            gameBoardDiv.id = "gameBoard";
            gameBoardContainer === null || gameBoardContainer === void 0 ? void 0 : gameBoardContainer.appendChild(gameBoardDiv);
            insertRestartButton();
        };
        // inserts two restart buttons into the DOM that resets the game
        var insertRestartButton = function () {
            var restartButtonDiv = document.createElement("div");
            restartButtonDiv.id = "restartButtonDiv";
            // create two buttons: 'normal reset' and 'full reset'
            var restartButton = document.createElement("p");
            var fullResetButton = document.createElement("p");
            // give buttons ID's and innerText
            restartButton.id = "restartButton";
            fullResetButton.id = "fullResetButton";
            restartButton.innerText = "Restart";
            fullResetButton.innerText = "Full Reset";
            // append Buttons to div
            restartButtonDiv.appendChild(restartButton);
            restartButtonDiv.appendChild(fullResetButton);
            gameBoardContainer === null || gameBoardContainer === void 0 ? void 0 : gameBoardContainer.appendChild(restartButtonDiv);
            // add click listeners for buttons
            restartButton.addEventListener("click", gameModule.resetGame);
            fullResetButton.addEventListener("click", gameModule.fullReset);
        };
        // populates GameBoardDiv with a grid where users can mark their symbol
        var initGameBoard = function () {
            var gameBoardDiv = document.querySelector("#gameBoard");
            for (var index in gameBoard) {
                var div = document.createElement("div");
                div.classList.add("divInsideBoard");
                div.textContent = "";
                div.id = index;
                // add listener to each 'square' div
                div.addEventListener("click", addMark);
                gameBoardDiv.appendChild(div);
            }
            gameModule.showTurn();
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
                        gameModule.aiPlay();
                    }
                    else if (!playerOne.ownTurn && playerTwo.ownTurn && playerTwo.name !== "AI") {
                        e.target.textContent = playerTwo.symbol;
                        setSymbolForGameBoardIndex(clickedSquareIndex, playerTwo.symbol);
                        playerModule.toggleTurns();
                        gameModule.checkForWinner();
                    }
                }
            }
        };
        return {
            initGameBoardDiv: initGameBoardDiv,
            initGameBoard: initGameBoard,
            getGameBoard: getGameBoard,
            setSymbolForGameBoardIndex: setSymbolForGameBoardIndex
        };
    })();
    // gameModule - tracks winners and draws. Resets game.
    var gameModule = (function () {
        var gameBoard = gameBoardModule.getGameBoard();
        // Populates a new div that asks if user wants to play against AI or another human.
        var initAiOrPlayerDiv = function () {
            footer === null || footer === void 0 ? void 0 : footer.classList.remove("opacity");
            var aiOrPlayerDiv = document.createElement("div");
            aiOrPlayerDiv.id = "aiOrPlayerDiv";
            //  gives instructions to user
            var h3 = document.createElement("h3");
            h3.innerText = "Pick Your Adversary";
            // creates aiAdversary 'button'
            var aiAdversaryP = document.createElement("p");
            aiAdversaryP.innerText = "AI \uD83E\uDD16";
            aiAdversaryP.classList.add("chooseAdversary");
            // creates humanAdversary 'button'
            var humanAdversaryP = document.createElement("p");
            humanAdversaryP.innerText = "Human \uD83D\uDC68";
            humanAdversaryP.classList.add("chooseAdversary");
            // Add elements to aiOrPlayerDiv
            aiOrPlayerDiv.appendChild(h3);
            aiOrPlayerDiv.appendChild(aiAdversaryP);
            aiOrPlayerDiv.appendChild(humanAdversaryP);
            // Append aiOrPlayerDiv to gameBoardContainer
            gameBoardContainer === null || gameBoardContainer === void 0 ? void 0 : gameBoardContainer.appendChild(aiOrPlayerDiv);
            // Add listeners to both 'buttons'
            aiAdversaryP.addEventListener("click", chosenGameMode);
            humanAdversaryP.addEventListener("click", chosenGameMode);
        };
        // validates user's choice in AiorPlayerDiv.
        var chosenGameMode = function (e) {
            gameModule.deleteElementById("aiOrPlayerDiv");
            var clickedButton = e.target.innerText;
            // if user picked AI adversary
            if (clickedButton === "AI \uD83E\uDD16") {
                gameModule.initPickNamesDiv("AI");
            }
            // if user picked human adversary
            else {
                gameModule.initPickNamesDiv("Human");
            }
        };
        // Deletes Divs
        var deleteElementById = function (idName) {
            var divToBeDeleted = document.querySelector("#" + idName);
            divToBeDeleted === null || divToBeDeleted === void 0 ? void 0 : divToBeDeleted.remove();
        };
        // Populates a new Div where user can type names of players
        var initPickNamesDiv = function (aiOrHuman) {
            var pickNamesDiv = document.createElement("div");
            pickNamesDiv.id = "pickNamesDiv";
            // create header instruction
            var headerInstruction = document.createElement("h4");
            headerInstruction.innerText = "Pick Player Names:";
            pickNamesDiv.appendChild(headerInstruction);
            // create player 1 input
            var playerOneName = document.createElement("input");
            playerOneName.placeholder = "Player 1";
            playerOneName.id = "playerOne";
            playerOneName.classList.add("nameInputs");
            pickNamesDiv.appendChild(playerOneName);
            // create player 2 input if playing against a player.
            if (aiOrHuman === "Human") {
                var playerTwoName = document.createElement("input");
                playerTwoName.placeholder = "Player 2";
                playerTwoName.id = "playerTwo";
                playerTwoName.classList.add("nameInputs");
                pickNamesDiv.appendChild(playerTwoName);
            }
            // add startGameButton
            var startGameButton = document.createElement("p");
            startGameButton.innerText = "Start Game";
            startGameButton.id = "startGame";
            startGameButton.addEventListener("click", nameInputValidation);
            pickNamesDiv.appendChild(startGameButton);
            // append pickNamesDiv to gameBoardContainer
            gameBoardContainer === null || gameBoardContainer === void 0 ? void 0 : gameBoardContainer.appendChild(pickNamesDiv);
        };
        // Check if name inputs are filled in and under 15 char.
        var nameInputValidation = function () {
            var playerOneName;
            var playerTwoName;
            var allNameInputs = document.querySelectorAll("input");
            allNameInputs.forEach(function (input) {
                if (input.id === "playerOne") {
                    playerOneName = input.value;
                    if (!playerModule.nameUnderFifteenChar(playerOneName)) {
                        playerOneName = undefined;
                    }
                }
                else {
                    playerTwoName = input.value;
                    if (!playerModule.nameUnderFifteenChar(playerTwoName) || playerTwoName === "AI") {
                        playerOneName = undefined;
                    }
                }
            });
            playerModule.createPlayers(playerOneName, playerTwoName);
        };
        // lets AI play a randomPlay
        var aiPlay = function () {
            if (!gameHasEnded && playerTwo.name === "AI") {
                var playableSquares = [];
                var gameBoard_1 = gameBoardModule.getGameBoard();
                // check squares that AI can mark down
                for (var i = 0; i < gameBoard_1.length; i++) {
                    if (gameBoard_1[i] === "") {
                        playableSquares.push(i);
                    }
                }
                var randomNumber = Math.floor(Math.random() * playableSquares.length);
                var randomIndex = playableSquares[randomNumber];
                // play randomly chosen index
                gameBoardModule.setSymbolForGameBoardIndex(randomIndex, "O");
                var targetSquare = document.getElementById("" + randomIndex);
                targetSquare.textContent = "O";
                checkForWinner();
                playerModule.toggleTurns();
                showTurn();
            }
        };
        // displays who's turn it is on the screen
        var showTurn = function () {
            title === null || title === void 0 ? void 0 : title.classList.add("turnEffect");
            if (playerModule.isPlayerOneTurn()) {
                title.innerText = playerOne.name + "'s Turn";
            }
            if (playerModule.isPlayerTwoTurn()) {
                title.innerText = playerTwo.name + "'s Turn";
            }
        };
        // resetGame: remove the child elements of gameBoardContainer from DOM, reset gameBoard and run initGameBoard.
        var resetGame = function () {
            deleteElementById("gameBoard");
            deleteElementById("displayWinner");
            deleteElementById("displayDraw");
            deleteElementById("restartButtonDiv");
            for (var index = 0; index < gameBoard.length; index++) {
                gameBoardModule.setSymbolForGameBoardIndex(index, "");
            }
            gameHasEnded = false;
            playerOne.ownTurn = true;
            playerTwo.ownTurn = false;
            footer === null || footer === void 0 ? void 0 : footer.classList.remove("opacity");
            gameBoardModule.initGameBoardDiv();
            gameBoardModule.initGameBoard();
        };
        //    fullReset: takes usero the first Menu
        var fullReset = function () {
            title.innerText = "Tic-Tac-Toe";
            title.classList.remove("turnEffect");
            deleteElementById("gameBoard");
            deleteElementById("displayWinner");
            deleteElementById("displayDraw");
            deleteElementById("restartButtonDiv");
            for (var index = 0; index < gameBoard.length; index++) {
                gameBoardModule.setSymbolForGameBoardIndex(index, "");
            }
            gameHasEnded = false;
            playerOne.ownTurn = true;
            playerTwo.ownTurn = false;
            gameModule.initAiOrPlayerDiv();
        };
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
        // Check for Winner
        var checkForWinner = function () {
            if (!gameHasEnded) {
                winningCombinations.forEach(function (winPossibility) {
                    var symbols = [];
                    winPossibility.forEach(function (index) {
                        symbols.push(gameBoard[index]);
                    });
                    if (symbols.toString() === "X,X,X") {
                        displayWinner(playerOne.name);
                        winnerFound = true;
                        gameHasEnded = true;
                    }
                    else if (symbols.toString() === "O,O,O") {
                        displayWinner(playerTwo.name);
                        winnerFound = true;
                        gameHasEnded = true;
                    }
                });
            }
            ;
            if (!gameHasEnded) {
                gameModule.showTurn();
                gameModule.checkForDraw();
            }
        };
        // Display Winner
        var displayWinner = function (playerName) {
            if (document.querySelector("#displayWinner")) {
                return;
            }
            footer === null || footer === void 0 ? void 0 : footer.classList.add("opacity");
            resetTicTacToeHeader();
            var displayWinner = document.createElement("p");
            displayWinner.innerText = "The Winner is: " + playerName + "!";
            displayWinner.id = "displayWinner";
            gameBoardContainer === null || gameBoardContainer === void 0 ? void 0 : gameBoardContainer.appendChild(displayWinner);
        };
        // Reset 'Tic-Tac-Toe' Header To Original State
        var resetTicTacToeHeader = function () {
            title.classList.remove("turnEffect");
            title.innerText = "Tic-Tac-Toe";
        };
        // Look for draws
        var checkForDraw = function () {
            var markedDivs = 0;
            for (var i = 0; i < gameBoard.length; i++) {
                if (gameBoard[i] !== "") {
                    markedDivs++;
                }
            }
            if (markedDivs === gameBoard.length) {
                displayDraw();
            }
        };
        // Displays Draw
        var displayDraw = function () {
            gameHasEnded = true;
            resetTicTacToeHeader();
            footer === null || footer === void 0 ? void 0 : footer.classList.add("opacity");
            title.classList.remove("turnEffect");
            var displayDraw = document.createElement("p");
            displayDraw.innerText = "It's a draw!!";
            displayDraw.id = "displayDraw";
            gameBoardContainer === null || gameBoardContainer === void 0 ? void 0 : gameBoardContainer.appendChild(displayDraw);
        };
        return {
            resetGame: resetGame,
            fullReset: fullReset,
            checkForWinner: checkForWinner,
            checkForDraw: checkForDraw,
            initAiOrPlayerDiv: initAiOrPlayerDiv,
            deleteElementById: deleteElementById,
            aiPlay: aiPlay,
            initPickNamesDiv: initPickNamesDiv,
            showTurn: showTurn
        };
    })();
    // Inits the game by asking the user if he wants to play against AI or a Player.
    gameModule.initAiOrPlayerDiv();
});
