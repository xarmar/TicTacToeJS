document.addEventListener("DOMContentLoaded", function () {

const title = document.querySelector("h1");
const gameBoardContainer = document.querySelector("#gameBoardContainer");
var gameHasEnded: boolean;
var winnerFound = false;
var playerOne;
var playerTwo;

// playerModule - playerFactory(), toggleTurns(), nameUnderFifteenChar
const playerModule = (() => {
    const playerFactory = (name: string, number: number, symbol: string, ownTurn: boolean) => {
        return {name, number, symbol, ownTurn};
    };
    // toggles who's turn it is: Player1 or Player 2.
    const toggleTurns = () => {
        playerOne.ownTurn ? playerOne.ownTurn = false : playerOne.ownTurn = true;
        playerTwo.ownTurn ? playerTwo.ownTurn = false : playerTwo.ownTurn = true;
    }
    
    // checks who's turn it is: playerOne or PlayerTwo
    const isPlayerOneTurn = () => playerOne.ownTurn ? true : false;
    const isPlayerTwoTurn = () => playerTwo.ownTurn ? true : false;
    

    const nameUnderFifteenChar = (name: any) => {
        if (!name) {
            alert("Please fill in all inputs.");
            return
        }
        if(name.length < 15) {
            return true
        }
        alert("Names must be under 15 chars.");
        return false
    }
    return {
        playerFactory: playerFactory,
        toggleTurns: toggleTurns,
        isPlayerOneTurn : isPlayerOneTurn,
        isPlayerTwoTurn: isPlayerTwoTurn,
        nameUnderFifteenChar: nameUnderFifteenChar
    }
})();

// gameBoardModule - getGameBoard(), setSymbolForGameBoardIndex(), initGameBoardDiv(), insertRestartButton(), initGameBoard(), addMark()
const gameBoardModule = (() => {
    const gameBoard:string[] = ["","","","","","","","",""];

    // gets current gameBoard
    const getGameBoard = () => {
        return gameBoard
    }
    // sets gameBoard with a specific symbol
    const setSymbolForGameBoardIndex = (index:number, symbol:string) => {
        gameBoard[index] = symbol
    }
   
    // inserts new div "gameBoard" and calls insertRestartButton function
    const initGameBoardDiv = () => {
        const gameBoardDiv = document.createElement("div");
        gameBoardDiv.id = "gameBoard";
        gameBoardContainer?.appendChild(gameBoardDiv);
        insertRestartButton();
    }

    // inserts a restart button into the DOM that resets the game
    const insertRestartButton = () => {
        const restartButtonDiv = document.createElement("div");
        restartButtonDiv.id = "restartButtonDiv";
        // create two buttons: 'normal reset' and 'full reset'
        const restartButton = document.createElement("p");
        const fullResetButton = document.createElement("p");
        // give buttons ID's and innerText
        restartButton.id = "restartButton";
        fullResetButton.id = "fullResetButton";
        restartButton.innerText = "Restart";
        fullResetButton.innerText = "Full Reset";
        // append Buttons to div
        restartButtonDiv.appendChild(restartButton);
        restartButtonDiv.appendChild(fullResetButton);
        gameBoardContainer?.appendChild(restartButtonDiv);
        restartButton.addEventListener("click", gameModule.resetGame);
        fullResetButton.addEventListener("click", gameModule.fullReset);
    }

    // populates GameBoardDiv with a grid where users mark
    const initGameBoard = () => {
        let gameBoardDiv = document.querySelector("#gameBoard");
        for (let index in gameBoard) {
            let div = document.createElement("div");
            div.classList.add("divInsideBoard");
            div.textContent = "";
            div.id = index;
            div.addEventListener("click", addMark);
            gameBoardDiv.appendChild(div);
        }
        gameModule.showTurn();
    }

    // Adds player's symbol to clicked div.
    const addMark = (e) => {
        if (!gameHasEnded) {
            let clickedSquareText = e.target.innerText;
            let clickedSquareIndex = e.target.id;
            if(clickedSquareText === "") {
                if(playerOne.ownTurn && !playerTwo.ownTurn) {
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
    }
    return {
        gameBoard,
        initGameBoardDiv: initGameBoardDiv,
        initGameBoard: initGameBoard,
        getGameBoard,
        setSymbolForGameBoardIndex: setSymbolForGameBoardIndex
        }
})();

// gameModule - tracks winners and draws. Resets game.
const gameModule = (() => {
    let gameBoard = gameBoardModule.getGameBoard();

    // Populates a new div that asks if user wants to play against AI or another human.
    const initAiOrPlayerDiv  = () => {
        let aiOrPlayerDiv = document.createElement("div");
        aiOrPlayerDiv.id = "aiOrPlayerDiv";

        let h3 = document.createElement("h3");
        h3.innerText = "Pick Your Adversary"
        // creates aiAdversary p
        let aiAdversaryP = document.createElement("p");
        aiAdversaryP.innerText = "AI \uD83E\uDD16";
        aiAdversaryP.classList.add("chooseAdversary")
        // creates humanAdversary p
        let humanAdversaryP = document.createElement("p");
        humanAdversaryP.innerText = "Human \u{1F468}";
        humanAdversaryP.classList.add("chooseAdversary")

        // Add elements to aiOrPlayerDiv
        aiOrPlayerDiv.appendChild(h3);
        aiOrPlayerDiv.appendChild(aiAdversaryP);
        aiOrPlayerDiv.appendChild(humanAdversaryP);

        // Append aiOrPlayerDiv to gameBoardContainer
        gameBoardContainer?.appendChild(aiOrPlayerDiv);

        // Add listeners to both buttons p elements
        aiAdversaryP.addEventListener("click", chosenGameMode);
        humanAdversaryP.addEventListener("click",chosenGameMode);
    }

    // validates user's choice in AiorPlayerDiv.
    const chosenGameMode = (e) => {
        gameModule.deleteDiv("aiOrPlayerDiv");
        let clickedButton = e.target.innerText;
        // if user picked AI adversary
        if (clickedButton === "AI \uD83E\uDD16") {
            gameModule.initPickNamesDiv("AI");
            
        }
        // if user picked human adversary
        else {
            gameModule.initPickNamesDiv("Human");
        }
    }

    // Deletes Divs
    const deleteDiv = (divName: string) => {
        let divToBeDeleted = document.querySelector(`#${divName}`);
        divToBeDeleted?.remove();
    }

    // Populates a new Div where user can type names of players
    const initPickNamesDiv = (aiOrHuman: string) => {
        let pickNamesDiv = document.createElement("div");
        pickNamesDiv.id = "pickNamesDiv"
        // create header instruction
        let headerInstruction = document.createElement("h4");
        headerInstruction.innerText = "Pick Player Names:";
        pickNamesDiv.appendChild(headerInstruction);
        // create player 1 input
        let playerOneName = document.createElement("input");
        playerOneName.placeholder = "Player 1";
        playerOneName.id = "playerOne";
        playerOneName.classList.add("nameInputs");
        pickNamesDiv.appendChild(playerOneName);
        // create player 2 input if playing against a player.
        if(aiOrHuman === "Human") {
            let playerTwoName = document.createElement("input");
            playerTwoName.placeholder = "Player 2";
            playerTwoName.id = "playerTwo"
            playerTwoName.classList.add("nameInputs");
            pickNamesDiv.appendChild(playerTwoName);
        }
        // add startGameButton
        let startGameButton = document.createElement("p");
        startGameButton.innerText = "Start Game";
        startGameButton.id = "startGame";
        startGameButton.addEventListener("click", nameInputValidation);
        pickNamesDiv.appendChild(startGameButton);

        // append pickNamesDiv to gameBoardContainer
        gameBoardContainer?.appendChild(pickNamesDiv);
    }

    // Check if name inputs are filled in and under 15 char.
    const nameInputValidation = () => {
        let playerOneName;
        let playerTwoName;
        let allNameInputs = document.querySelectorAll("input");
        allNameInputs.forEach(input => {
            if(input.id === "playerOne") {
                playerOneName = input.value;
                if(!playerModule.nameUnderFifteenChar(playerOneName)) {
                    playerOneName = undefined;
                }
            }
            else {
                playerTwoName = input.value;
                if(!playerModule.nameUnderFifteenChar(playerTwoName)) {
                    playerOneName = undefined;
                }
            }
        });
        createPlayers(playerOneName, playerTwoName);
    }

    const createPlayers = (playerOneName, playerTwoName) => {
        // if its just AI
        if (playerOneName && !playerTwoName) {
            let playerOne = playerModule.playerFactory(playerOneName, 1, "X", true);
            return playerOne
        }

        // if against human - create both players
        if (playerOneName && playerTwoName) {
            playerOne = playerModule.playerFactory(playerOneName, 1, "X", true);
            playerTwo = playerModule.playerFactory(playerTwoName, 2, "O", false);
            deleteDiv("pickNamesDiv");
            gameBoardModule.initGameBoardDiv();
            gameBoardModule.initGameBoard();
        }
    }

    const showTurn = () => {
        title?.classList.add("turnEffect")
        if(playerModule.isPlayerOneTurn()) {
            title.innerText = playerOne.name + "'s Turn"
        }
        if(playerModule.isPlayerTwoTurn()) {
            title.innerText = playerTwo.name + "'s Turn"
        }
    }

    // resetGame: remove the child elements of gameBoard from DOM, and run initGameBoard.
    const resetGame = () => {
        deleteDiv("gameBoard");
        deleteDiv("displayWinner");
        deleteDiv("restartButtonDiv");
        for (let index = 0; index < gameBoard.length; index++) {
            gameBoardModule.setSymbolForGameBoardIndex(index, "");
        }
        gameHasEnded = false;
        playerOne.ownTurn = true;
        playerTwo.ownTurn = false;
        gameBoardModule.initGameBoardDiv();
        gameBoardModule.initGameBoard();
   }

    //    fullReset: takes usero the first Menu
    const fullReset = () => {
        title.innerText = "Tic-Tac-Toe";
        title.classList.remove("turnEffect");
        deleteDiv("gameBoard");
        deleteDiv("displayWinner");
        deleteDiv("restartButtonDiv");
        for (let index = 0; index < gameBoard.length; index++) {
            gameBoardModule.setSymbolForGameBoardIndex(index, "");
        }
        gameHasEnded = false;
        playerOne.ownTurn = true;
        playerTwo.ownTurn = false;
        gameModule.initAiOrPlayerDiv();
    }




    // Check for Win Combinations and for Draws
    let winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6] 
    ];

    const checkForWinner = () => {
        if(!gameHasEnded) {
            winningCombinations.forEach(winPossibility => {
                let symbols:string[] = []
                winPossibility.forEach(index => {
                    symbols.push(gameBoard[index]);
                });
                if(symbols.toString() === "X,X,X") {
                    displayWinner(playerOne.name)
                    winnerFound = true;
                    gameHasEnded = true;
                }
                else if (symbols.toString() === "O,O,O") {
                    displayWinner(playerTwo.name);
                    winnerFound = true;
                    gameHasEnded = true;
                }
            })};
        if(!gameHasEnded) {
            gameModule.showTurn();
        }
        }
    

    const resetTicTacToeHeader = () => {
        title.classList.remove("turnEffect");
        title.innerText = "Tic-Tac-Toe";
    }

    const displayWinner = (playerName) => {
        resetTicTacToeHeader();
        let displayWinner = document.createElement("p");
        displayWinner.innerText = `The Winner is: ${playerName}!`
        displayWinner.id = "displayWinner";
        gameBoardContainer?.appendChild(displayWinner);
    }

    const checkForDraw = () => {
        let markedDivs = 0
        for (let i = 0; i < gameBoard.length; i++) {
            if(gameBoard[i] !== "") {
                markedDivs++
            }
        }
        if (markedDivs === gameBoard.length && !winnerFound) {
            resetTicTacToeHeader();
            alert("It's a draw!");
        }
    }

    return {
        resetGame : resetGame,
        fullReset: fullReset,
        checkForWinner: checkForWinner,
        checkForDraw: checkForDraw,
        initAiOrPlayerDiv: initAiOrPlayerDiv,
        deleteDiv: deleteDiv,
        createPlayers: createPlayers,
        initPickNamesDiv: initPickNamesDiv,
        showTurn: showTurn
    }
})();

// Inits the game by asking the user if he wants to play against AI or a Player.
gameModule.initAiOrPlayerDiv();
});