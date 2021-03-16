import { shuffleArray } from "./shuffle.js";
import { calculateScore } from "./score.js";
import { Quadrant, tiles } from "./tiles.js"

var sector = (function () {

    function Game() {

        this.winner = null;

        this.deck = JSON.parse(JSON.stringify(tiles));

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

        // Shuffle the tiles
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

        // Flip up the top in the tile deck
        game.offer.tile = game.deck.pop();
        game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let element = document.getElementById("offer_row" + row_index + "col" + column_index);
            clearColors(element);
            clearSymbols(element);
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
            element.classList.add("offer_row" + row_index + "_col" + column_index)
        }))

        // Disable the move buttons except for the ones to move a tile onto the board
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

        // Set the buttons to first player color
        let buttons = document.getElementsByTagName("button")
        Array.from(buttons).forEach(button => button.classList.remove("player2"))

        // Hide the score from the previous game and display the button to score
        document.getElementById('score').classList.add('hidden');
        document.getElementById('score_button').classList.remove('hidden');

        return game
    }

    function clearColors(element) {
        element.classList.remove(
            "red",
            "blue",
            "black"
        )
    }

    function clearSymbols(element) {
        element.classList.remove(
            "moon",
            "star",
            "planet",
            "whirl"
        )
    }

    function move(row_increment, column_increment) {
        // Control movement for the offer tile, which consists of 4 quadrants

        // If moving onto the board
        if (this.game.offer.row === null) {
            // Clear the offer
            this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let element = document.getElementById("offer_row" + row_index + "col" + column_index);
                clearColors(element);
                clearSymbols(element);
                element.classList.remove(
                    "offer_row0_col0",
                    "offer_row0_col1",
                    "offer_row1_col0",
                    "offer_row1_col1"
                )
            }))

            // Update the offer position
            this.game.offer.row = 8; // Row is always 8 when moving onto the board
            this.game.offer.column = 4 + column_increment;
        } else {
            // Otherwise, moving within the board
            // Clear the styling from the old position
            this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let row = this.game.offer.row + row_index;
                let column = this.game.offer.column + column_index;
                let element = document.getElementById("row" + row + "col" + column + "overlay");
                clearColors(element);
                clearSymbols(element);
                element.classList.remove(
                    "offer_row0_col0",
                    "offer_row0_col1",
                    "offer_row1_col0",
                    "offer_row1_col1"
                )
            }))

            // Update the offer position
            this.game.offer.row += row_increment;
            this.game.offer.column += column_increment;
        }

        // Update the displayed remaining deck size
        document.getElementById("remaining").textContent = this.game.deck.length

        // Update the styling for the new offer position
        this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = this.game.offer.row + row_index;
            let column = this.game.offer.column + column_index;
            let element = document.getElementById("row" + row + "col" + column + "overlay");
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
            element.classList.add("offer_row" + row_index + "_col" + column_index)
        }))

        // Inactivate move buttons that would move the tile off of the board
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

        // Determine whether the tile placement is legal
        validatePlacement(this.game)
    }

    function rotate() {
        // Rotate the tile 90 degrees clockwise
        this.game.offer.tile.quadrants = [
            [this.game.offer.tile.quadrants[1][0], this.game.offer.tile.quadrants[0][0]],
            [this.game.offer.tile.quadrants[1][1], this.game.offer.tile.quadrants[0][1]]
        ]

        // Update styling
        if (this.game.offer.row === null) {
            this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let element = document.getElementById("offer_row" + row_index + "col" + column_index);
                clearColors(element);
                clearSymbols(element);
                element.classList.add(square.color)
                if (square.symbol) element.classList.add(square.symbol)
            }))

        } else {
            this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
                let row = this.game.offer.row + row_index;
                let column = this.game.offer.column + column_index;
                let element = document.getElementById("row" + row + "col" + column + "overlay");
                clearColors(element);
                clearSymbols(element);
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
            (board_colors[index] === 'red' && overlay_color === 'blue') ||
            (board_colors[index] === 'blue' && overlay_color === 'red')
        )
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
        ];
        let touching = offsetsToCheckTouching.filter(offset => {
            if (
                0 <= (row + offset.row_offset) &&
                (row + offset.row_offset) < 10 &&
                0 <= (column + offset.column_offset) &&
                (column + offset.column_offset) < 10
            ) {
                return game.board[row + offset.row_offset][column + offset.column_offset].color
            }
        }
        );

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
        // Disable the gameplay buttons
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
        document.getElementById("gameOverText").innerText = game.winner.toUpperCase() + "!" + "\nred: " + game.scores.red + "\nblue: " + game.scores.blue
        document.getElementById("closeGameOver").classList.add(game.winner)
        document.getElementById("gameOver").classList.remove("hidden")
        document.getElementById("gameOver").classList.add(game.winner)
    }

    function endTurn(doScoreAction = false) {

        // Update the board to reflect the overlay
        this.game.offer.tile.quadrants.forEach((row, row_index) => row.forEach((square, column_index) => {
            let row = this.game.offer.row + row_index;
            let column = this.game.offer.column + column_index;
            this.game.board[row][column].color = square.color
            this.game.board[row][column].symbol = square.symbol
            // and update the board styling
            let element = document.getElementById("row" + row + "col" + column + "played");
            clearColors(element);
            clearSymbols(element);
            element.classList.add(square.color)
            if (square.symbol) element.classList.add(square.symbol)
            // and clear the overlay styling
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
            // If the player hasn't scored, score them
            if (!this.game.scores[playerColor]) {
                this.game.scores[playerColor] = calculateScore(playerColor, this.game.board)
            }
            // If the opponent still hasn't scored, score them
            if (!this.game.scores[opponentColor]) {
                this.game.scores[opponentColor] = calculateScore(opponentColor, this.game.board);
                // In this case, ties tie
                if (this.game.scores[opponentColor] == this.game.scores[playerColor]) (this.game.winner = "tie");
            }
            if (!this.game.winner) (this.game.winner = (this.game.scores[playerColor] >= this.game.scores[opponentColor]) ? playerColor : opponentColor);
            gameOver(this.game);
            return;
        };

        if (doScoreAction) {
            this.game.scores[playerColor] = calculateScore(playerColor, this.game.board)

            // Now, end turn and score button disappears, replaced by the score
            let scoreDiv = document.getElementById('score')
            scoreDiv.innerText = playerColor.toUpperCase() + ': ' + this.game.scores[playerColor];
            scoreDiv.classList.remove('hidden');

            document.getElementById('score_button').classList.add('hidden');

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
            clearColors(board_element);
            clearSymbols(board_element);
            // Clear the overlay
            let overlay_element = document.getElementById("row" + row_index + "col" + column_index + "overlay");
            clearColors(overlay_element);
            clearSymbols(overlay_element);
            overlay_element.classList.remove(
                "offer_row0_col0",
                "offer_row0_col1",
                "offer_row1_col0",
                "offer_row1_col1")
        }))

        // Clear the game over color
        document.getElementById("closeGameOver").classList.remove('red', 'blue')
        document.getElementById("gameOver").classList.remove('red', 'blue')

        this.game = sector.setUpGame();
    }

    function showRules() {
        // Show the modal
        document.getElementById("rules").classList.remove("hidden");
        // Hide the last viewed rule
        document.getElementById("rule_" + this.game.currentRule).classList.add("hidden");
        // Show the first rule
        document.getElementById("rule_1").classList.remove("hidden");
        this.game.currentRule = 1
        // Disable the prev button, enable the next button
        document.getElementById("rule+-1").setAttribute("disabled", "");
        document.getElementById("rule+1").removeAttribute("disabled");
    }

    function changeRule(increment) {
        // Hide the current rule, show the next rule
        document.getElementById("rule_" + this.game.currentRule).classList.add("hidden");
        document.getElementById("rule_" + (this.game.currentRule + increment)).classList.remove("hidden");

        // If you can't show another rule in this direction, disable the button to show it
        if (!document.getElementById("rule_" + (this.game.currentRule + increment + increment))) {
            document.getElementById("rule+" + increment).setAttribute("disabled", "");
        } else {
            document.getElementById("rule+" + (-1 * increment)).removeAttribute("disabled");
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
