// let arrow keys control nav buttons
// rules
// jslint
// add confirmation for new game
// set max size of the buttons for large screen size

import { shuffleArray } from "./shuffle.js";
import { calculateScore } from "./score.js";
import { Quadrant, tiles } from "./tiles.js"

var sector = (function () {

    function Game() {

        this.winner = null;

        this.deck = tiles.slice();

        // The board starts off as a 10x10 grid of empty squares
        this.board = Array(10).fill(Array(10).fill(null)).map(row => row.map(square => new Quadrant({
            color: null,
            symbol: null
        })));

        // The overlay (showing the active tile) starts off as a 10x10 grid of transparent squares
        this.board_overlay = Array(10).fill(Array(10).fill(null)).map(row => row.map(square => new Quadrant({
            color: "transparent",
            symbol: null
        })));

        this.offer = {
            row: null,
            column: null,
            tile: null
        };

        this.scores = {
            red: null,
            blue: null
        };

        this.onFirstPlayer = true;

        this.getPlayerColor = function getPlayerColor(onFirstPlayer) {
            return onFirstPlayer ? "blue" : "red"
        };

        this.currentRule = 1;

    }

    function setUpGame() {
        let game = new Game();

        // Shuffle tiles
        shuffleArray(game.deck);

        // Draw the first tile and place it in the middle of the board
        let starting_tile = game.deck.pop();
        starting_tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = 4 + row_index;
            let column = 4 + column_index;
            game.board[row][column] = square;
            let element = document.getElementById("row" + row + "col" + column + "played");
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
        }))

        // Draw one for offer, update offer and render
        game.offer.tile = game.deck.pop();
        game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
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

        // Set buttons to first player color
        let buttons = document.getElementsByTagName("button")
        Array.from(buttons).forEach(button => button.classList.remove("player2"))

        let scoreDiv = document.getElementById('score')
        scoreDiv.classList.add('hidden');

        let end_turn_button = document.getElementById('score_button')
        end_turn_button.classList.remove('hidden');

        return game
    }

    function move(row_increment, column_increment) {

        // if moving onto the board
        if (this.game.offer.row === null) {
            // clear the offer styling
            this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let element = document.getElementById("offer_row" + row_index + "col" + column_index);
                element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl", "offer_row0_col0",
                    "offer_row0_col1",
                    "offer_row1_col0",
                    "offer_row1_col1")
            }))

            // Update offer position
            this.game.offer.row = 8; // Row is always 8 when moving onto the board
            this.game.offer.column = 4 + column_increment;
        } else { // moving within the board
            // Clear the styling from the old offer position
            this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let row = this.game.offer.row + row_index;
                let column = this.game.offer.column + column_index;
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
            this.game.offer.row += row_increment;
            this.game.offer.column += column_increment;
        }

        document.getElementById("remaining").textContent = this.game.deck.length


        // Update square styling with the new offer position
        this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = this.game.offer.row + row_index;
            let column = this.game.offer.column + column_index;
            let element = document.getElementById("row" + row + "col" + column + "overlay");
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
            element.classList.add("offer_row" + row_index + "_col" + column_index)
        }))

        // If it is invalid to move in a direction, inactivate those move buttons
        let valid_up = this.game.offer.row !== 0;
        let valid_down = this.game.offer.row + 1 !== (this.game.board.length - 1);
        let valid_left = this.game.offer.column !== 0;
        let valid_right = this.game.offer.column + 1 !== this.game.board[0].length - 1;
        valid_up ? document.getElementById("up").removeAttribute("disabled") : document.getElementById("up").setAttribute("disabled", "");
        valid_down ? document.getElementById("down").removeAttribute("disabled") : document.getElementById("down").setAttribute("disabled", "");
        valid_left ? document.getElementById("left").removeAttribute("disabled") : document.getElementById("left").setAttribute("disabled", "");
        valid_right ? document.getElementById("right").removeAttribute("disabled") : document.getElementById("right").setAttribute("disabled", "");
        (valid_left && valid_up) ? document.getElementById("left_up").removeAttribute("disabled") : document.getElementById("left_up").setAttribute("disabled", "");
        valid_right && valid_up ? document.getElementById("right_up").removeAttribute("disabled") : document.getElementById("right_up").setAttribute("disabled", "");
        valid_left && valid_down ? document.getElementById("left_down").removeAttribute("disabled") : document.getElementById("left_down").setAttribute("disabled", "");
        valid_right && valid_down ? document.getElementById("right_down").removeAttribute("disabled") : document.getElementById("right_down").setAttribute("disabled", "");

        validatePlacement(this.game)

        // Calculate the score and update the text in the "score" button
    }

    function rotate() {
        // Rotate the tile 90 degrees clockwise
        this.game.offer.tile.quadrants = [[this.game.offer.tile.quadrants[1][0], this.game.offer.tile.quadrants[0][0]], [this.game.offer.tile.quadrants[1][1], this.game.offer.tile.quadrants[0][1]]]

        // Update offer or square styling
        if (this.game.offer.row === null) {
            this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let element = document.getElementById("offer_row" + row_index + "col" + column_index);
                element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
                element.classList.add(square.color)
                if (square.symbol) element.classList.add(square.symbol)
            }))

        } else {
            this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let row = this.game.offer.row + row_index;
                let column = this.game.offer.column + column_index;
                let element = document.getElementById("row" + row + "col" + column + "overlay");
                element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl")
                element.classList.add(square.color)
                if (square.symbol) element.classList.add(square.symbol)
            }))
            validatePlacement(this.game)
        }

    }

    function validatePlacement(game) {
        // If blue is overlaid on red or vice versa, the placement is invalid
        let overlay_colors = game.offer.tile.quadrants.flat().map(quadrant => quadrant.color);
        let offsetsToCheckColor = [
            { row_offset: 0, column_offset: 0 }, { row_offset: 0, column_offset: 1 },
            { row_offset: 1, column_offset: 0 }, { row_offset: 1, column_offset: 1 }
        ];
        let row = game.offer.row;
        let column = game.offer.column;
        let board_colors = offsetsToCheckColor.map(offset => game.board[row + offset.row_offset][column + offset.column_offset].color);
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
                return game.board[row + offset.row_offset][column + offset.column_offset].color
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

    function gameOver(game) {
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

        // Show the winner
        document.getElementById("gameOverText").innerText = "Red: " + game.scores.red + "\nBlue: " + game.scores.blue + "\nWinner: " + game.winner
        document.getElementById("gameOver").classList.remove("hidden")
    }

    function endTurn(doScoreAction = false) {

        // Update the board variable
        this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = this.game.offer.row + row_index;
            let column = this.game.offer.column + column_index;
            this.game.board[row][column].color = square.color
            this.game.board[row][column].symbol = square.symbol
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

        let playerColor = this.game.getPlayerColor(this.game.onFirstPlayer)
        let opponentColor = this.game.getPlayerColor(!this.game.onFirstPlayer)

        // If no tiles remain, the game is over. Highest score wins.
        if (!this.game.deck.length) {
            this.game.scores[playerColor] = calculateScore(playerColor, this.game.board)
            if (!this.game.scores[opponentColor]) {
                // If the other player still hasn't scored, score them
                // In this case, ties win
                this.game.scores[opponentColor] = calculateScore(opponentColor, this.game.board);
                if (this.game.scores[opponentColor] == this.game.scores[playerColor]) (this.game.winner = "TIE");
            }
            if (!this.game.winner) (this.game.winner = (this.game.scores[playerColor] >= this.game.scores[opponentColor]) ? playerColor : opponentColor);
            gameOver(this.game);
            return;
        };

        if (doScoreAction) {
            this.game.scores[playerColor] = calculateScore(playerColor, this.game.board)

            // Now, end turn and score disappears, replaced by "score to beat"
            let scoreDiv = document.getElementById('score')
            scoreDiv.innerText = 'Score to beat: ' + this.game.scores[playerColor];
            scoreDiv.classList.remove('hidden');

            let end_turn_button = document.getElementById('score_button')
            end_turn_button.classList.add('hidden');

        } else {

            // If the other player has already scored, check if the new score is equal or higher
            if (this.game.scores[opponentColor] !== null) {
                let new_score = calculateScore(playerColor, this.game.board)
                if (new_score >= this.game.scores[opponentColor]) {
                    this.game.scores[playerColor] = new_score
                    this.game.winner = playerColor
                    gameOver(this.game);
                    return;
                }
            }
        }

        // Draw a new offer tile and reset the offer and render the offer
        this.game.offer = {
            row: null,
            column: null,
            tile: null
        }
        // Draw one for offer, update offer and render
        this.game.offer.tile = this.game.deck.pop();
        this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
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
        this.game.onFirstPlayer = !this.game.onFirstPlayer
    }

    function newGame() {
        this.game.board.forEach((row, row_index) => row.forEach((square, column_index) => {
            // Clear the board
            let board_element = document.getElementById("row" + row_index + "col" + column_index + "played");
            board_element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl");
            // clear the overlay
            let overlay_element = document.getElementById("row" + row_index + "col" + column_index + "overlay");
            overlay_element.classList.remove("red", "blue", "black", "moon", "star", "planet", "whirl", "offer_row0_col0",
                "offer_row0_col1",
                "offer_row1_col0",
                "offer_row1_col1")
        }))

        this.game = sector.setUpGame();

    }

    function showRules() {
        // show the modal
        let rules = document.getElementById("rules");
        rules.classList.remove("hidden");
        // hide the last viewed rule
        document.getElementById("rule_" + this.game.currentRule).classList.add("hidden");
        // show the first rule
        document.getElementById("rule_1").classList.remove("hidden");
        this.game.currentRule = 1
    }

    function changeRule(increment) {
        document.getElementById("rule_" + this.game.currentRule).classList.add("hidden");
        document.getElementById("rule_" + (this.game.currentRule + increment)).classList.remove("hidden");

        if (!document.getElementById("rule_" + (this.game.currentRule + increment + increment))) {
            document.getElementById("rule+" + increment).classList.add("hidden")
        } else {
            document.getElementById("rule+" + (-1 * increment)).classList.remove("hidden")
        }
        this.game.currentRule += increment
    }

    function closeModal(element) {
        element.parentNode.classList.add("hidden")
    }

    return {
        setUpGame: setUpGame,
        move: move,
        rotate: rotate,
        newGame: newGame,
        showRules: showRules,
        endTurn: endTurn,
        closeModal: closeModal,
        changeRule: changeRule
    }
}());

sector.game = sector.setUpGame()


document.getElementById("rotate").addEventListener("click", function () {
    sector.rotate()
});
document.getElementById("left_up").addEventListener("click", function () {
    sector.move(-1, -1)
});
document.getElementById("up").addEventListener("click", function () {
    sector.move(-1, 0)
});
document.getElementById("right_up").addEventListener("click", function () {
    sector.move(-1, 1)
});
document.getElementById("left").addEventListener("click", function () {
    sector.move(0, -1)
});
document.getElementById("right").addEventListener("click", function () {
    sector.move(0, 1)
});
document.getElementById("left_down").addEventListener("click", function () {
    sector.move(1, -1)
});
document.getElementById("down").addEventListener("click", function () {
    sector.move(1, 0)
});
document.getElementById("right_down").addEventListener("click", function () {
    sector.move(1, 1)
});
document.getElementById("newGame").addEventListener("click", function () {
    sector.newGame()
});
document.getElementById("openRules").addEventListener("click", function () {
    sector.showRules()
});
document.getElementById("end_turn_button").addEventListener("click", function () {
    sector.endTurn()
});
document.getElementById("score_button").addEventListener("click", function () {
    sector.endTurn(true)
});
document.getElementById("closeRules").addEventListener("click", function () {
    sector.closeModal(this)
});
document.getElementById("rule+-1").addEventListener("click", function () {
    sector.changeRule(-1)
});
document.getElementById("rule+1").addEventListener("click", function () {
    sector.changeRule(1)
});
document.getElementById("closeGameOver").addEventListener("click", function () {
    sector.closeModal(this)
});
