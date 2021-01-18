// TODO
// input tiles
// how to import. then move other components to separate files
// scoring
// let arrow keys control nav buttons
// desktop styling
// rules
// border around active tile
// end turn and score
// make navigation icons images instead or html symbols
// fint size should scale with screen

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
    constructor({ id, quadrants }) {
        this.id = id;
        this.quadrants = quadrants;
    }
}

const tiles = [
    new Tile({
        id: 1,
        quadrants: [
            [
                new Quadrant({
                    color: "blue",
                    symbol: "moon"
                }),
                new Quadrant({
                    color: "red",
                    symbol: "planet"
                })
            ],
            [
                new Quadrant({
                    color: "black",
                    symbol: null
                }),
                new Quadrant({
                    color: "blue",
                    symbol: "planet"
                })
            ]
        ]
    }),

    new Tile({
        id: 2,
        quadrants: [
            [
                new Quadrant({
                    color: "red",
                    symbol: "star"
                }),
                new Quadrant({
                    color: "black",
                    symbol: null
                })
            ],
            [
                new Quadrant({
                    color: "blue",
                    symbol: "planet"
                }),
                new Quadrant({
                    color: "blue",
                    symbol: "star"
                })
            ]
        ]
    }),

    new Tile({
        quadrants: [
            [
                new Quadrant({
                    color: "red",
                    symbol: "whirl"
                }),
                new Quadrant({
                    color: "red",
                    symbol: "moon"
                })
            ],
            [
                new Quadrant({
                    color: "red",
                    symbol: "whirl"
                }),
                new Quadrant({
                    color: "black",
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
                    symbol: "star"
                }),
                new Quadrant({
                    color: "red",
                    symbol: "star"
                })
            ],
            [
                new Quadrant({
                    color: "blue",
                    symbol: "planet"
                }),
                new Quadrant({
                    color: "black",
                    symbol: null
                })
            ]
        ]
    }),
]

let deck
let board
let board_overlay
let offer
let player_color

// Setup Game
function setUpGame() {

    board = Array(10).fill(Array(10).fill(null));
    // board = Array.from({ length: 10 }, e => Array(10).fill(null))
    board = board.map(row => row.map(square => new Quadrant({
        color: "black",
        symbol: null
    })))

    board_overlay = Array(10).fill(Array(10).fill(null));
    board_overlay = board_overlay.map(row => row.map(square => new Quadrant({
        color: "transparent",
        symbol: null
    })))

    offer = {
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

    starting_tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = 4 + row_index;
        let column = 4 + column_index;
        board[row][column] = square;
        let element = document.getElementById("row" + row + "col" + column + "played");
        element.classList.add(square.color)
        if (square.symbol) element.classList.add(square.symbol)
    }))

    // Draw one for offer, update offer and render
    offer.tile = deck.pop();
    offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let element = document.getElementById("offer_row" + row_index + "col" + column_index);
        element.classList.add(square.color)
        if (square.symbol) element.classList.add(square.symbol)
    }))

    // Disable the move buttons except for the ones to enter the board
    document.getElementById("left").setAttribute("disabled", "")
    document.getElementById("right").setAttribute("disabled", "")
    document.getElementById("down").setAttribute("disabled", "")
    document.getElementById("left_down").setAttribute("disabled", "")
    document.getElementById("right_down").setAttribute("disabled", "")
    document.getElementById("end_turn_button").setAttribute("disabled", "");
    document.getElementById("score_button").setAttribute("disabled", "");

    document.getElementById("up").removeAttribute("disabled");
    document.getElementById("left_up").removeAttribute("disabled");
    document.getElementById("right_up").removeAttribute("disabled");
    document.getElementById("rotate").removeAttribute("disabled");

}

setUpGame()

function move(row_increment, column_increment) {

    // if moving onto the board
    if (offer.row === null) {
        // clear the offer styling
        offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let element = document.getElementById("offer_row" + row_index + "col" + column_index);
            element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
        }))

        // Update offer position
        offer.row = 8; // Row is always 8 when moving onto the board
        offer.column = 4 + column_increment;
    } else { // moving within the board
        // Clear the styling from the old offer position
        offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = offer.row + row_index;
            let column = offer.column + column_index;
            let element = document.getElementById("row" + row + "col" + column + "overlay");
            element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
        }))

        // Update offer position
        offer.row += row_increment;
        offer.column += column_increment;
    }

    document.getElementById("offer_row1col0").textContent = deck.length + " remaining"


    // Update square styling with the new offer position
    offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = offer.row + row_index;
        let column = offer.column + column_index;
        let element = document.getElementById("row" + row + "col" + column + "overlay");
        element.classList.add(square.color)
        if (square.symbol) element.classList.add(square.symbol)
    }))

    // If it is invalid to move in a direction, inactivate those move buttons
    let valid_up = offer.row !== 0;
    let valid_down = offer.row + 1 !== (board.length - 1);
    let valid_left = offer.column !== 0;
    let valid_right = offer.column + 1 !== board[0].length - 1;
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
    offer.tile.quadrants = [[offer.tile.quadrants[1][0], offer.tile.quadrants[0][0]], [offer.tile.quadrants[1][1], offer.tile.quadrants[0][1]]]

    // Update offer or square styling
    if (offer.row === null) {
        offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let element = document.getElementById("offer_row" + row_index + "col" + column_index);
            element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
        }))

    } else {
        offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = offer.row + row_index;
            let column = offer.column + column_index;
            let element = document.getElementById("row" + row + "col" + column + "overlay");
            element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
        }))
        validatePlacement()
    }

}

function validatePlacement() {
    // If the tile can't be placed, inactivate the "end turn" buttons
    overlay_colors = offer.tile.quadrants.flat().map(quadrant => quadrant.color)
    let row = offer.row;
    let column = offer.column;
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
    // offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
    //     let row = offer.row + row_index;
    //     let column = offer.column + column_index;
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
    offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = offer.row + row_index;
        let column = offer.column + column_index;
        board[row][column].color = square.color
        board[row][column].symbol = square.symbol
        // and transfer the style to the board
        let element = document.getElementById("row" + row + "col" + column + "played");
        element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
        element.classList.add(square.color)
        if (square.symbol) element.classList.add(square.symbol)
        // and clear the overlay
        element = document.getElementById("row" + row + "col" + column + "overlay");
        element.classList.remove(square.color)
        element.classList.remove(square.symbol)
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

    // Draw a new offer tile and reset the offer and render the offer
    offer = {
        row: null,
        column: null,
        tile: null
    }
    // Draw one for offer, update offer and render
    offer.tile = deck.pop();
    offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
        let element = document.getElementById("offer_row" + row_index + "col" + column_index);
        element.classList.add(square.color)
        if (square.symbol) element.classList.add(square.symbol)

    }))

    // update # remaining in draw pile
    document.getElementById("offer_row1col0").textContent = ""

    // Disable the move buttons except for the ones to enter the board
    document.getElementById("left").setAttribute("disabled", "")
    document.getElementById("right").setAttribute("disabled", "")
    document.getElementById("down").setAttribute("disabled", "")
    document.getElementById("left_down").setAttribute("disabled", "")
    document.getElementById("right_down").setAttribute("disabled", "")
    document.getElementById("end_turn_button").setAttribute("disabled", "");
    document.getElementById("score_button").setAttribute("disabled", "");

    document.getElementById("up").removeAttribute("disabled");
    document.getElementById("left_up").removeAttribute("disabled");
    document.getElementById("right_up").removeAttribute("disabled");
    document.getElementById("rotate").removeAttribute("disabled");


    // Switch player color
    player_color === 'red' ? player_color = 'blue' : player_color = 'red'
}

function score() {
    //TODO
}

function endTurnAndScore() {
    //TODO
}

function newGame() {
    board.forEach((row, row_index) => row.forEach((square, column_index) => {
        let element = document.getElementById("row" + row_index + "col" + column_index + "played");
        element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
        element = document.getElementById("row" + row_index + "col" + column_index + "overlay");
        element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
    }))
    document.getElementById("offer_row1col0").textContent = ""

    setUpGame()
}