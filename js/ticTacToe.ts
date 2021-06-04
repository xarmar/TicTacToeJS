document.addEventListener("DOMContentLoaded", function () {

const gameBoardDiv = document.querySelector("#gameBoard")!;
const restartButton = document.querySelector("#restartButton")!;

// Define playerFactory
const playerFactory = (name: string, number: number, symbol: string, ownTurn: boolean) => {
    return {name, number, symbol: symbol, ownTurn};
};

// Create two new players. playerOne goes first
const playerOne = playerFactory("Alpha", 1, "X", true);
const playerTwo = playerFactory("Omega", 2, "O", false);

var gameHasEnded;

// Game Module to start game, reset game, toggle player turns, add marks, etc.
const ticTacToeGame = (() => {
    const gameBoard = ["","","","","","","","",""]


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
    // remove the child elements of gameBoard from DOM, and run initGameBoard.
    const resetGame = () => {
        while (gameBoardDiv.firstChild) {
            gameBoardDiv.removeChild(gameBoardDiv.firstChild);
        }
        for (let index = 0; index < gameBoard.length; index++) {
           gameBoard[index] = ""; 
       }

       gameHasEnded = false;
       playerOne.ownTurn = true;
       playerTwo.ownTurn = false;
       initGameBoard();
   }
    // toggles who's turn it is: Player1 or Player 2.
    const toggleTurns = () => {
        playerOne.ownTurn ? playerOne.ownTurn = false : playerOne.ownTurn = true;
        playerTwo.ownTurn ? playerTwo.ownTurn = false : playerTwo.ownTurn = true;
    }
    // Adds player's symbol to clicked div.
    const addMark = (e) => {
        if (!gameHasEnded) {
            let currentSquare = e.target.innerText;
            if(currentSquare === "") {
                if(playerOne.ownTurn && !playerTwo.ownTurn) {
                    e.target.textContent = playerOne.symbol;
                    gameBoard[e.target.id] = playerOne.symbol
                    toggleTurns();
                    checkForWinner(gameBoard);
                }
                else if (!playerOne.ownTurn && playerTwo.ownTurn) {
                    e.target.textContent = playerTwo.symbol;
                    gameBoard[e.target.id] = playerTwo.symbol
                    toggleTurns();
                    checkForWinner(gameBoard);
                }
            }
        }
    }

    restartButton.addEventListener("click", resetGame);

    return {
        initGameBoard: initGameBoard,
        resetGame: resetGame,
        gameBoard
        }
})();

// Winner and Draw Module Checker
const checkForWinner = ((gameBoard) => {
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

if(!gameHasEnded) {
    winningCombinations.forEach(winPossibility => {
        let symbols = []
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
    });
}

});
// Starts the Game By Populating the Gameboard
ticTacToeGame.initGameBoard();

});