// TODO
// input tiles
// 
// let arrow keys control nav buttons

// import { tiles } from './tiles.js'
// import { shuffleArray } from './shuffle.js'

// const tiles = require("./tiles")
// const shuffleArray = require("./shuffle");

// Swap each value in an array, starting at the end of the array, with a position equal or earlier in the array.
function shuffleArray(array) {
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

]

let deck
let board
let overlay
let player_color

// Setup Game
function setUpGame() {

    board = Array(10).fill(Array(10).fill(null));
    // board = Array.from({ length: 10 }, e => Array(10).fill(null))
    board = board.map(row => row.map(square => new Quadrant({
        color: "black",
        symbol: null
    })))
    overlay = {
        row: null,
        column: null,
        tile: null
    }
    player_color = 'blue'

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
    document.getElementById("deck").textContent = deck.length

        // Disable the move buttons except for down
        document.getElementById("up").setAttribute("disabled", "")
        document.getElementById("left").setAttribute("disabled", "")
        document.getElementById("right").setAttribute("disabled", "")
        document.getElementById("left_up").setAttribute("disabled", "")
        document.getElementById("right_up").setAttribute("disabled", "")
        document.getElementById("left_down").setAttribute("disabled", "")
        document.getElementById("right_down").setAttribute("disabled", "")
    

}

setUpGame()

function move(row_increment, column_increment) {

    // Clear the styling from the old overlay position
    if (overlay.row !== null && overlay.column !== null) {
        overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = overlay.row + row_index;
            let column = overlay.column + column_index;
            let element = document.getElementById("row" + row + "col" + column);
            element.style.backgroundColor = board[row][column].color;
        }))
    }

    // If moving onto the board, clear the offer styling
    if (overlay.row === null) {
        overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let element = document.getElementById("offer_row" + row_index + "col" + column_index);
            element.style.backgroundColor = "black";
        }))
    }

    // Update overlay position
    overlay.row === null ? overlay.row = 0 : overlay.row += row_increment;
    overlay.column === null ? overlay.column = 0 : overlay.column += column_increment;

    // Update square styling with the new overlay position
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

    validatePlacement()

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

    validatePlacement()
}

function validatePlacement() {
    // If the tile can't be placed, inactivate the "end turn" buttons
    overlay_colors = overlay.tile.quadrants.flat().map(quadrant => quadrant.color)
    let row = overlay.row;
    let column = overlay.column;
    board_colors = [
        { row_offset: 0, column_offset: 0 }, { row_offset: 0, column_offset: 1 },
        { row_offset: 1, column_offset: 0 }, { row_offset: 1, column_offset: 1 }
    ].map(offset => board[row + offset.row_offset][column + offset.column_offset].color)
    valids = overlay_colors.map((color, index) => (
        (board_colors[index] === 'red' && color === 'blue') || (board_colors[index] === 'blue' && color === 'red'))
    )
    v = valids.some(valid => valid)
    if (v) {
        document.getElementById("end_turn_button").setAttribute("disabled", "");
        document.getElementById("score_button").setAttribute("disabled", "");
    } else {
        document.getElementById("end_turn_button").removeAttribute("disabled")
        document.getElementById("score_button").removeAttribute("disabled")
    }
    // overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
    //     let row = overlay.row + row_index;
    //     let column = overlay.column + column_index;
    //     let overlay_color = square.color;
    //     let tile_color = board[row][column].color;
    //     if ((tile_color === 'red' && overlay_color === "blue") || (tile_color === 'blue' && overlay_color === "red")) {
    //         document.getElementById("end_turn_button").setAttribute("disabled", "");
    //         document.getElementById("score_button").setAttribute("disabled", "");
    //         return;
    //     } else {
    //         document.getElementById("end_turn_button").removeAttribute("disabled")
    //         document.getElementById("score_button").removeAttribute("disabled")
    //     }
    // }))
}

function endTurn() {

    // Update the board variable
    overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = overlay.row + row_index;
        let column = overlay.column + column_index;
        board[row][column].color = square.color
        board[row][column].symbol = square.symbol
    }))

    // If no tiles remain, the game is over
    if (!deck.length) {
        // disable the buttons
        document.getElementById("end_turn_button").setAttribute("disabled", "");
        document.getElementById("score_button").setAttribute("disabled", "");
        document.getElementById("up").setAttribute("disabled", "");
        document.getElementById("down").setAttribute("disabled", "");
        document.getElementById("left").setAttribute("disabled", "");
        document.getElementById("right").setAttribute("disabled", "");
        document.getElementById("left_up").setAttribute("disabled", "");
        document.getElementById("right_up").setAttribute("disabled", "");
        document.getElementById("left_down").setAttribute("disabled", "");
        document.getElementById("right_down").setAttribute("disabled", "");
        document.getElementById("rotate").setAttribute("disabled", "");

        return;
    };

    // Draw a new offer tile and reset the overlay and render the overlay
    overlay = {
        row: null,
        column: null,
        tile: null
    }
    // Draw one for offer, update overlay and render
    overlay.tile = deck.pop();
    overlay.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let element = document.getElementById("offer_row" + row_index + "col" + column_index);
        element.style.backgroundColor = square.color;
    }))

    // update # remaining in draw pile
    document.getElementById("deck").textContent = deck.length

    // Disable the move buttons except for down
    document.getElementById("up").setAttribute("disabled", "")
    document.getElementById("left").setAttribute("disabled", "")
    document.getElementById("right").setAttribute("disabled", "")
    document.getElementById("left_up").setAttribute("disabled", "")
    document.getElementById("right_up").setAttribute("disabled", "")
    document.getElementById("left_down").setAttribute("disabled", "")
    document.getElementById("right_down").setAttribute("disabled", "")

    // Switch player color
    player_color === 'red' ? player_color = 'blue' : player_color = 'red'
    document.getElementById("offer").style["border-color"] = player_color
}

function score() {
    //TODO
}

function endTurnAndScore() {
    //TODO
}
