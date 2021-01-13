// TODO
// input tiles
// 
// let arrow keys control nav buttons

// import { tiles } from './tiles.js'
// import { shuffleArray } from './shuffle.js'

// const tiles = require("./tiles")
// const shuffleArray = require("./shuffle");

function shuffleArray(array) {
    // Swap each value in an array, starting at the end of the array, with a position equal or earlier in the array.
    for (let index = array.length - 1; index > 0; index--) {

        // Get a random index from 0 to the current index of the array
        // So for an array of length 3, the first round will be 0, 1, or 2, second round 0 or 1, and last round 0
        // The values at this index and the current index will be swapped
        let swapIndex = Math.floor(Math.random() * (index + 1));

        // If the current index and index to swap are the same, move on to the next loop iteration
        if (index === swapIndex) {
            continue;
        }

        // Get the original value at index,
        // set the value at the index to be the value at the swap index,
        // then set the value at the swap index to be the original value at the index
        let swapValue = array[index];
        array[index] = array[swapIndex];
        array[swapIndex] = swapValue;
    }
}

class Quadrant {
    constructor({ color, symbol }) {
        this.color = color;
        this.symbol = symbol;
    }
}

class Tile {
    constructor({ quadrants }) {
        this.quadrants = quadrants;
    }
}

const tiles = [
    new Tile({
        quadrants: [
            [
                new Quadrant({
                    color: "red",
                    symbol: null
                }),
                new Quadrant({
                    color: "blue",
                    symbol: null
                })
            ],
            [
                new Quadrant({
                    color: "blue",
                    symbol: null
                }),
                new Quadrant({
                    color: "blue",
                    symbol: null
                })
            ]
        ]
    }),

    new Tile({
        quadrants: [
            [
                new Quadrant({
                    color: "blue",
                    symbol: null
                }),
                new Quadrant({
                    color: "red",
                    symbol: null
                })
            ],
            [
                new Quadrant({
                    color: "red",
                    symbol: null
                }),
                new Quadrant({
                    color: "blue",
                    symbol: null
                })
            ]
        ]
    }),

    new Tile({
        quadrants: [
            [
                new Quadrant({
                    color: "red",
                    symbol: null
                }),
                new Quadrant({
                    color: "red",
                    symbol: null
                })
            ],
            [
                new Quadrant({
                    color: "red",
                    symbol: null
                }),
                new Quadrant({
                    color: "blue",
                    symbol: null
                })
            ]
        ]
    })

]

function makeQuad() {
    return new Quadrant({
        color: "black",
        symbol: null
    })
}

var deck = [];
// let board = Array(10).fill(Array(10).fill(makeQuad()));
let board = Array.from({ length: 10 }, e => Array(10).fill(new Quadrant({
    color: "black",
    symbol: null
})))
let overlay = {
    row: null,
    column: null,
    tile: null
}

// Setup Game
function setUpGame() {

    // Shuffle tiles
    deck = tiles.slice();
    shuffleArray(deck);

    // Put one in middle of board (populate board, render tile)
    starting_tile = deck.pop();
    board[4][4] = starting_tile.quadrants[0][0]
    board[4][5] = starting_tile.quadrants[0][1]
    board[5][4] = starting_tile.quadrants[1][0]
    board[5][5] = starting_tile.quadrants[1][1]
    board.forEach((row, row_index) => row.forEach((square, column_index) => {
        let element = document.getElementById("row" + row_index + "col" + column_index);
        element.style.backgroundColor = square.color;
    }))

    // Draw one for offer, update overlay and render
    overlay.tile = deck.pop();
    overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let element = document.getElementById("offer_row" + row_index + "col" + column_index);
        element.style.backgroundColor = square.color;
    }))

    // update # remaining in draw pile
    console.log(deck)
    document.getElementById("deck").textContent = deck.length

}

setUpGame()

function move(row_increment, column_increment) {

    // Clear the styling on the old squares
    overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = overlay.row + row_index;
        let column = overlay.column + column_index;
        if (row !== null && column !== null) {
            let element = document.getElementById("row" + row + "col" + column);
            console.log(board[row][column])
            element.style.backgroundColor = board[row][column].color;
        }
    }))

    // If moving onto the board, clear the offer
    if (overlay.row === null) {
        overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let element = document.getElementById("offer_row" + row_index + "col" + column_index);
            element.style.backgroundColor = "black";
        }))
    }
    // Update overlay position
    overlay.row === null ? overlay.row = 0 : overlay.row += row_increment;
    overlay.column === null ? overlay.column = 0 : overlay.column += column_increment;

    // Update square styling
    overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = overlay.row + row_index;
        let column = overlay.column + column_index;
        let element = document.getElementById("row" + row + "col" + column);
        element.style.backgroundColor = square.color;
    }))

    // If it is invalid to move in a direction, inactivate those move buttons
    let valid_up = overlay.row !== 0;
    let valid_down = overlay.row + 1 !== (board.length - 1);
    let valid_left = overlay.column !== 0;
    let valid_right = overlay.column + 1 !== board[0].length - 1;
    valid_up ? document.getElementById("up").removeAttribute("disabled") : document.getElementById("up").setAttribute("disabled", "");
    valid_down ? document.getElementById("down").removeAttribute("disabled") : document.getElementById("down").setAttribute("disabled", "");
    valid_left ? document.getElementById("left").removeAttribute("disabled") : document.getElementById("left").setAttribute("disabled", "");
    valid_right ? document.getElementById("right").removeAttribute("disabled") : document.getElementById("right").setAttribute("disabled", "");
    (valid_left && valid_up) ? document.getElementById("left_up").removeAttribute("disabled") : document.getElementById("left_up").setAttribute("disabled", "");
    valid_right && valid_up ? document.getElementById("right_up").removeAttribute("disabled") : document.getElementById("right_up").setAttribute("disabled", "");
    valid_left && valid_down ? document.getElementById("left_down").removeAttribute("disabled") : document.getElementById("left_down").setAttribute("disabled", "");
    valid_right && valid_down ? document.getElementById("right_down").removeAttribute("disabled") : document.getElementById("right_down").setAttribute("disabled", "");

    // Calculate the score and update the text in the "score" button
}

function rotate() {
    // Rotate the tile 90 degrees clockwise
    overlay.tile.quadrants = [[overlay.tile.quadrants[1][0], overlay.tile.quadrants[0][0]], [overlay.tile.quadrants[1][1], overlay.tile.quadrants[0][1]]]

    // Update offer or square styling
    if (overlay.row === null) {
        overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let element = document.getElementById("offer_row" + row_index + "col" + column_index);
            element.style.backgroundColor = square.color;
        }))

    } else {
        overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = overlay.row + row_index;
            let column = overlay.column + column_index;
            let element = document.getElementById("row" + row + "col" + column);
            element.style.backgroundColor = square.color;
        }))
    }
}

function endTurn() {
    //TODO
}
function score() {
    //TODO
}
function endTurnAndScore() {
    //TODO
}

function newGame() {
    //TODO
}