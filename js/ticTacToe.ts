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

// Game Module to start game, reset game, toggle player turns, add marks, etc.
const ticTacToeGame = (() => {
    const gameBoard = ["","","","","","","","",""]

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

    const resetGame = () => {
        while (gameBoardDiv.firstChild) {
            gameBoardDiv.removeChild(gameBoardDiv.firstChild);
        }
        for (let index = 0; index < gameBoard.length; index++) {
           gameBoard[index] = ""; 
       }
       initGameBoard();
   }

    const toggleTurns = () => {
        playerOne.ownTurn ? playerOne.ownTurn = false : playerOne.ownTurn = true;
        playerTwo.ownTurn ? playerTwo.ownTurn = false : playerTwo.ownTurn = true;
    }

    const addMark = (e) => {
        let currentSquare = e.target.innerText;
        if(currentSquare === "") {
            if(playerOne.ownTurn && !playerTwo.ownTurn) {
                e.target.textContent = playerOne.symbol;
                gameBoard[e.target.id] = playerOne.symbol
                toggleTurns();
            }
            else if (!playerOne.ownTurn && playerTwo.ownTurn) {
                e.target.textContent = playerTwo.symbol;
                gameBoard[e.target.id] = playerTwo.symbol
                toggleTurns();
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

const checkForWinner = (() => {
let winningCombination = [
[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 3, 8],
[0, 4, 8],
[2, 4, 6] 
];

winningCombination.forEach(winPossibility => {
    
});




});
// Starts the Game By Populating the Gameboard
ticTacToeGame.initGameBoard();



// close 1st function
});