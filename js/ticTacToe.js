document.addEventListener("DOMContentLoaded", function () {

    // Try tucking everything away inside of a module or factory. Rule of thumb: 
    // if you only ever need ONE of something (gameBoard, displayController), use a module. If you need 
    // multiples of something (players!), create them with factories.

const gameBoardDiv = document.querySelector("#gameBoard")
const ticTacToeModule = (() => {

const gameBoard = ["", "", "", "", "", "", "", "", ""];

const populateGameBoard = () => {
    for (square in gameBoard) {
        let p = document.createElement("p");
        p.classList.add("squareInsideBoard");
        p.innerText = "X";
        gameBoardDiv.appendChild(p);
    }
}

populateGameBoard();




})();

// Define playerFactory and create players
const playerFactory = (number, letter) => {
    return {number, letter};
};

const playerOne = playerFactory(1, "X");
const playerTwo = playerFactory(2, "O");

// populate gameboard


// close 1st function
});