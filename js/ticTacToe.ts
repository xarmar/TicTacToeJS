document.addEventListener("DOMContentLoaded", function () {

const gameBoardDiv = document.querySelector("#gameBoard")!;
const restartButton = document.querySelector("#restartButton")!;
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
    const setGameBoard = (index:number, symbol:string) => {
        gameBoard[index] = symbol
    }
   
    // populate gameBoard with 9 empty divs.
    const initGameBoard = () => {
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
            let currentSquare = e.target.innerText;
            if(currentSquare === "") {
                if(playerOne.ownTurn && !playerTwo.ownTurn) {
                    e.target.textContent = playerOne.symbol;
                    gameBoard[e.target.id] = playerOne.symbol
                    playerModule.toggleTurns();
                    gameModule.lookForWinner();
                }
                else if (!playerOne.ownTurn && playerTwo.ownTurn) {
                    e.target.textContent = playerTwo.symbol;
                    gameBoard[e.target.id] = playerTwo.symbol
                    playerModule.toggleTurns();
                    gameModule.lookForWinner();
                }
            }
        }
    }
    return {
        gameBoard,
        initGameBoard: initGameBoard,
        getGameBoard,
        setGameBoard
        }
})();

// gameModule - tracks winners, draws and resets game.
const gameModule = (() => {
    let gameBoard = gameBoardModule.getGameBoard();

    // resetGame: remove the child elements of gameBoard from DOM, and run initGameBoard.
    const resetGame = () => {
        while (gameBoardDiv.firstChild) {
            gameBoardDiv.removeChild(gameBoardDiv.firstChild);
        }
        for (let index = 0; index < gameBoard.length; index++) {
           gameBoardModule.setGameBoard(index, "");
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

    const lookForWinner = () => {
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

    return {
        resetGame : resetGame,
        lookForWinner: lookForWinner
    }
})();


// Create two new players. playerOne goes first
const playerOne = playerModule.playerFactory("Alpha", 1, "X", true);
const playerTwo = playerModule.playerFactory("Omega", 2, "O", false);
// Starts the Game By Populating the Gameboard
gameBoardModule.initGameBoard();
// Listen for clicks to restart Game
restartButton.addEventListener("click", gameModule.resetGame);

});