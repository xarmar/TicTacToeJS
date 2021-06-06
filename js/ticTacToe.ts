document.addEventListener("DOMContentLoaded", function () {

const gameBoardContainer = document.querySelector("#gameBoardContainer");
const restartButton = document.querySelector("#restartButton");
var gameHasEnded; 

// playerModule - playerFactory, toggleTurns
const playerModule = (() => {
    const playerFactory = (name: string, number: number, symbol: string, ownTurn: boolean) => {
        return {name, number, symbol: symbol, ownTurn};
    };
    // toggles who's turn it is: Player1 or Player 2.
    const toggleTurns = () => {
        playerOne.ownTurn ? playerOne.ownTurn = false : playerOne.ownTurn = true;
        playerTwo.ownTurn ? playerTwo.ownTurn = false : playerTwo.ownTurn = true;
    }
    return {
        playerFactory: playerFactory,
        toggleTurns: toggleTurns
    }
})();

// gameBoardModule - sets gameboard, starts game(populates DOM), adds player marks, etc.
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
        const restartButton = document.createElement("button");
        restartButton.id = "restartButton";
        restartButton.innerText = "Restart"
        restartButtonDiv.appendChild(restartButton);
        gameBoardContainer?.appendChild(restartButtonDiv);
        restartButton.addEventListener("click", gameModule.resetGame);
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

// gameModule - tracks winners, draws and resets game.
const gameModule = (() => {
    let gameBoard = gameBoardModule.getGameBoard();

    // Ask if user wants to play against AI or another player.
    const aiOrPlayerAdversary  = () => {
        let chooseAdversaryDiv = document.createElement("div");
        chooseAdversaryDiv.id = "adversaryDiv";

        let h3 = document.createElement("h3");
        h3.innerText = "Pick Your Adversary"
        // creates aiAdversary p
        let aiAdversaryP = document.createElement("p");
        aiAdversaryP.innerText = "AI \uD83E\uDD16";
        aiAdversaryP.classList.add("chooseAdversary")
        // creates playerAdversary p
        let humanAdversaryP = document.createElement("p");
        humanAdversaryP.innerText = "Human \u{1F468}";
        humanAdversaryP.classList.add("chooseAdversary")

        // Add elements to chooseAdversaryDiv
        chooseAdversaryDiv.appendChild(h3);
        chooseAdversaryDiv.appendChild(aiAdversaryP);
        chooseAdversaryDiv.appendChild(humanAdversaryP);


        // Append chooseAdversaryDiv to gameBoardContainer
        gameBoardContainer?.appendChild(chooseAdversaryDiv);
    }

    // resetGame: remove the child elements of gameBoard from DOM, and run initGameBoard.
    const resetGame = () => {
        let gameBoardDiv = document.querySelector("#gameBoard");
        while (gameBoardDiv.firstChild) {
            gameBoardDiv.removeChild(gameBoardDiv.firstChild);
        }
        for (let index = 0; index < gameBoard.length; index++) {
           gameBoardModule.setSymbolForGameBoardIndex(index, "");
       }

       gameHasEnded = false;
       playerOne.ownTurn = true;
       playerTwo.ownTurn = false;
       gameBoardModule.initGameBoard();
   }
    // winner gameController
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
                    alert("The Winner is " + playerOne.name);
                    gameHasEnded = true;
                }
                else if (symbols.toString() === "O,O,O") {
                    alert("The Winner is " + playerTwo.name);
                    gameHasEnded = true;
                }
            })};
        }

    const checkForDraw = () => {
        let markedDivs = 0
        for (let i = 0; i < gameBoard.length; i++) {
            if(gameBoard[i] !== "") {
                markedDivs++
            }
        }
        if (markedDivs === gameBoard.length) {
            alert("It's a draw!");
        }
    }

    return {
        aiOrPlayerAdversary: aiOrPlayerAdversary,
        resetGame : resetGame,
        checkForWinner: checkForWinner,
        checkForDraw: checkForDraw
    }
})();

// Create two new players. playerOne goes first
const playerOne = playerModule.playerFactory("Alpha", 1, "X", true);
const playerTwo = playerModule.playerFactory("Omega", 2, "O", false);


gameModule.aiOrPlayerAdversary();
// Starts the Game By Populating the Gameboard
// gameBoardModule.initGameBoardDiv();
// gameBoardModule.initGameBoard();
// Listen for clicks to restart Game
});