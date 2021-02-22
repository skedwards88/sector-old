// how to import. then move other components to separate files
// let arrow keys control nav buttons
// rules
// jslint
// add confirmation for new game
// set max size of the buttons for large screen size
// readme

import { shuffleArray } from "./shuffle.js";
import { Quadrant, tiles } from "./tiles.js"

var sector = (function () {

    let deck
    let winner
    let board
    let board_overlay
    let offer
    let scores = {
        red: null,
        blue: null
    }
    let onFirstPlayer = true
    function getPlayerColor(onFirstPlayer) {
        return onFirstPlayer ? "blue" : "red"
    }
    let currentRule = 1

    // Setup Game
    function setUpGame() {

        // The board starts off as a 10x10 grid of empty squares
        board = Array(10).fill(Array(10).fill(null));
        board = board.map(row => row.map(square => new Quadrant({
            color: null,
            symbol: null
        })))

        // The overlay (showing the active tile) starts off as a 10x10 grid of transparent squares
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

        // Shuffle tiles
        deck = tiles.slice();
        shuffleArray(deck);

        // Put one tile in middle of board (populate board, render tile)
        let starting_tile = deck.pop();
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
            element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
            element.classList.add("offer_row" + row_index + "_col" + column_index)
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

        let scoreDiv = document.getElementById('score')
        scoreDiv.classList.add('hidden');

        let end_turn_button = document.getElementById('score_button')
        end_turn_button.classList.remove('hidden');
    }

    setUpGame()

    document.getElementById("rotate").addEventListener("click", function () {
        rotate()
    });
    document.getElementById("left_up").addEventListener("click", function () {
        move(-1, -1)
    });
    document.getElementById("up").addEventListener("click", function () {
        move(-1, 0)
    });
    document.getElementById("right_up").addEventListener("click", function () {
        move(-1, 1)
    });
    document.getElementById("left").addEventListener("click", function () {
        move(0, -1)
    });
    document.getElementById("right").addEventListener("click", function () {
        move(0, 1)
    });
    document.getElementById("left_down").addEventListener("click", function () {
        move(1, -1)
    });
    document.getElementById("down").addEventListener("click", function () {
        move(1, 0)
    });
    document.getElementById("right_down").addEventListener("click", function () {
        move(1, 1)
    });
    document.getElementById("newGame").addEventListener("click", function () {
        newGame()
    });
    document.getElementById("openRules").addEventListener("click", function () {
        showRules()
    });
    document.getElementById("end_turn_button").addEventListener("click", function () {
        endTurn()
    });
    document.getElementById("score_button").addEventListener("click", function () {
        endTurn(true)
    });
    document.getElementById("closeRules").addEventListener("click", function () {
        closeModal(this)
    });
    document.getElementById("rule+-1").addEventListener("click", function () {
        changeRule(-1)
    });
    document.getElementById("rule+1").addEventListener("click", function () {
        changeRule(1)
    });
    document.getElementById("closeGameOver").addEventListener("click", function () {
        closeModal(this)
    });


    function move(row_increment, column_increment) {

        // if moving onto the board
        if (offer.row === null) {
            // clear the offer styling
            offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let element = document.getElementById("offer_row" + row_index + "col" + column_index);
                element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl", "offer_row0_col0",
                    "offer_row0_col1",
                    "offer_row1_col0",
                    "offer_row1_col1")
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
                element.classList.remove(
                    "red",
                    "blue",
                    "black",
                    "moon",
                    "star",
                    "planet",
                    "whirl",
                    "offer_row0_col0",
                    "offer_row0_col1",
                    "offer_row1_col0",
                    "offer_row1_col1"
                )
            }))

            // Update offer position
            offer.row += row_increment;
            offer.column += column_increment;
        }

        document.getElementById("remaining").textContent = deck.length


        // Update square styling with the new offer position
        offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = offer.row + row_index;
            let column = offer.column + column_index;
            let element = document.getElementById("row" + row + "col" + column + "overlay");
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
            element.classList.add("offer_row" + row_index + "_col" + column_index)
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
        // If blue is overlaid on red or vice versa, the placement is invalid
        let overlay_colors = offer.tile.quadrants.flat().map(quadrant => quadrant.color);
        let offsetsToCheckColor = [
            { row_offset: 0, column_offset: 0 }, { row_offset: 0, column_offset: 1 },
            { row_offset: 1, column_offset: 0 }, { row_offset: 1, column_offset: 1 }
        ];
        let row = offer.row;
        let column = offer.column;
        let board_colors = offsetsToCheckColor.map(offset => board[row + offset.row_offset][column + offset.column_offset].color);
        let invalid_overlays = overlay_colors.filter((overlay_color, index) => (
            (board_colors[index] === 'red' && overlay_color === 'blue') || (board_colors[index] === 'blue' && overlay_color === 'red'))
        )

        // If none of the overlaid quadrants overlay or share and edge with the existing board quadrants, placement is invalid
        let offsetsToCheckTouching = [
            { row_offset: -1, column_offset: 0 },
            { row_offset: -1, column_offset: 1 },
            { row_offset: 0, column_offset: -1 },
            { row_offset: 0, column_offset: 0 },
            { row_offset: 0, column_offset: 1 },
            { row_offset: 0, column_offset: 2 },
            { row_offset: 1, column_offset: -1 },
            { row_offset: 1, column_offset: 0 },
            { row_offset: 1, column_offset: 1 },
            { row_offset: 1, column_offset: 2 },
            { row_offset: 2, column_offset: 0 },
            { row_offset: 2, column_offset: 1 },
        ]
        let touching = offsetsToCheckTouching.filter(offset => {
            if (0 <= (row + offset.row_offset) && (row + offset.row_offset) < 10 && 0 <= (column + offset.column_offset) && (column + offset.column_offset) < 10) {
                return board[row + offset.row_offset][column + offset.column_offset].color
            }
        }
        )

        // If any overlaid colors are illegal or the overlay is not touching any existing quadrants, inactivate the "end turn" buttons
        if (invalid_overlays.length !== 0 || touching.length === 0) {
            document.getElementById("end_turn_button").setAttribute("disabled", "");
            document.getElementById("score_button").setAttribute("disabled", "");
        } else {
            document.getElementById("end_turn_button").removeAttribute("disabled")
            document.getElementById("score_button").removeAttribute("disabled")
        }
    }

    function gameOver() {
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
        document.getElementById("gameOverText").innerText = "Red: " + scores.red + "\nBlue: " + scores.blue + "\nWinner: " + winner
        document.getElementById("gameOver").classList.remove("hidden")

    }

    function endTurn(doScoreAction = false) {

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
            element.classList.remove(
                "offer_row0_col0",
                "offer_row0_col1",
                "offer_row1_col0",
                "offer_row1_col1"
            )
        }))

        let playerColor = getPlayerColor(onFirstPlayer)
        let opponentColor = getPlayerColor(!onFirstPlayer)

        // If no tiles remain, the game is over. Highest score wins.
        if (!deck.length) {
            scores[playerColor] = calculateScore(playerColor)
            if (!scores[opponentColor]) {
                // If the other player still hasn't scored, score them
                // In this case, ties win
                scores[opponentColor] = calculateScore(opponentColor);
                if (scores[opponentColor] == scores[playerColor]) (winner = "TIE");
            }
            if (!winner) (winner = (scores[playerColor] >= scores[opponentColor]) ? playerColor : opponentColor);
            gameOver();
            return;
        };

        if (doScoreAction) {
            scores[playerColor] = calculateScore(playerColor)

            // Now, end turn and score disappears, replaced by "score to beat"
            let scoreDiv = document.getElementById('score')
            scoreDiv.innerText = 'Score to beat: ' + scores[playerColor];
            scoreDiv.classList.remove('hidden');

            let end_turn_button = document.getElementById('score_button')
            end_turn_button.classList.add('hidden');

        } else {

            // If the other player has already scored, check if the new score is equal or higher
            if (scores[opponentColor] !== null) {
                let new_score = calculateScore(playerColor)
                if (new_score >= scores[opponentColor]) {
                    scores[playerColor] = new_score
                    winner = playerColor
                    gameOver();
                    return;
                }
            }
        }

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
            element.classList.add("offer_row" + row_index + "_col" + column_index)

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

        // Switch player color
        let buttons = document.getElementsByTagName("button")
        Array.from(buttons).forEach(button => button.classList.toggle("player2"))
        onFirstPlayer = !onFirstPlayer
    }

    class Cluster {
        constructor({ indexes = new Set(), symbols = new Set() }) {
            this.indexes = indexes;
            this.symbols = symbols;
        }

        get score() {
            return (this.indexes.size + this.symbols.size);
        }
    }

    function findClusters(color, board) {
        let clusters = []
        let row_deltas = [-1, 1, 0, 0];
        let col_deltas = [0, 0, -1, 1];


        board.forEach((row, row_index) => row.forEach((square, column_index) => {
            if (square.color == color) {
                // Set up for iteration
                let cluster = new Cluster({});
                let coordinatesToSearch = [[row_index, column_index]];
                // Semi-iterative function to search around each coordinate of interest
                // for squares of the same color
                while (coordinatesToSearch.length > 0) {
                    let [search_row, search_column] = coordinatesToSearch.pop();
                    // Record this square in the cluster
                    cluster.indexes.add(JSON.stringify([search_row, search_column]));
                    if (board[search_row][search_column].symbol) {
                        cluster.symbols.add(board[search_row][search_column].symbol)
                    }
                    // Clear the color from the board so we don't record it more than once
                    board[search_row][search_column].color = 'black'
                    // Search up/down/left right for squares of the same color
                    // If one is found, add it to the list of coordinates to search
                    row_deltas.forEach((row_delta, i) => {
                        let column_delta = col_deltas[i];
                        try {
                            if (board[search_row + row_delta][search_column + column_delta]['color'] == color) {
                                coordinatesToSearch.push([search_row + row_delta, search_column + column_delta])
                            }
                        } catch {
                            // don't worry if we're at the edge of the board, just quiet the error
                        }
                    })
                }
                // Add this cluster to the list of clusters
                clusters.push(cluster)
            }
        }
        ))
        return clusters
    }

    function calculateScore(color) {
        let boardCopy = JSON.parse(JSON.stringify(board));

        let clusters = findClusters(color, boardCopy);

        let scores = clusters.map(cluster => cluster.score);

        return Math.max(...scores)
    }


    function newGame() {
        board.forEach((row, row_index) => row.forEach((square, column_index) => {
            let element = document.getElementById("row" + row_index + "col" + column_index + "played");
            element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
            element = document.getElementById("row" + row_index + "col" + column_index + "overlay");
            element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl", "offer_row0_col0",
                "offer_row0_col1",
                "offer_row1_col0",
                "offer_row1_col1")
        }))

        winner = null

        setUpGame()
    }

    function showRules() {
        console.log("RULES")
        // show the modal
        let rules = document.getElementById("rules");
        rules.classList.remove("hidden");
        // hide the last viewed rule
        document.getElementById("rule_" + currentRule).classList.add("hidden");
        // show the first rule
        document.getElementById("rule_1").classList.remove("hidden");
        currentRule = 1
    }

    function changeRule(increment) {
        document.getElementById("rule_" + currentRule).classList.add("hidden");
        document.getElementById("rule_" + (currentRule + increment)).classList.remove("hidden");

        if (!document.getElementById("rule_" + (currentRule + increment + increment))) {
            document.getElementById("rule+" + increment).classList.add("hidden")
        } else {
            document.getElementById("rule+" + (-1 * increment)).classList.remove("hidden")
        }
        currentRule += increment
    }

    function closeModal(element) {
        element.parentNode.classList.add("hidden")
    }

    return {
        setUpGame: setUpGame
    }
}());

sector.setUpGame()
