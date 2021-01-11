// TODO
// let arrow keys control nav buttons


let squares = Array(10).fill(Array(10).fill({ color: "black", symbol: null }));
let overlay = {
    row: null,
    column: null,
    squares: [
        [{ color: "black", symbol: null }, { color: "blue", symbol: null }],
        [{ color: "red", symbol: null }, { color: "red", symbol: null }]
    ]
}

function move(row_increment, column_increment) {

    // Clear the styling on the old squares
    overlay.squares.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = overlay.row + row_index;
        let column = overlay.column + column_index;
        if (row !== null && column !== null) {
            let element = document.getElementById("row" + row + "col" + column);
            element.style.backgroundColor = squares[row][column]["color"];
        }
    }))

    // Update overlay position
    overlay.row === null ? overlay.row = 0 : overlay.row += row_increment;
    overlay.column === null ? overlay.column = 0 : overlay.column += column_increment;

    // Update square styling
    overlay.squares.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = overlay.row + row_index;
        let column = overlay.column + column_index;
        let element = document.getElementById("row" + row + "col" + column);
        element.style.backgroundColor = square.color;
    }))

    // If it is invalid to move in a direction, inactivate those move buttons
    let valid_up = overlay.row !== 0;
    let valid_down = overlay.row + 1 !== (squares.length - 1);
    let valid_left = overlay.column !== 0;
    let valid_right = overlay.column + 1 !== squares[0].length - 1;
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
    overlay.squares = [[overlay.squares[1][0], overlay.squares[0][0]], [overlay.squares[1][1], overlay.squares[0][1]]]

    // Update square styling
    overlay.squares.forEach((row, row_index) => row.forEach((square, column_index) => {
        let row = overlay.row + row_index;
        let column = overlay.column + column_index;
        let element = document.getElementById("row" + row + "col" + column);
        element.style.backgroundColor = square.color;
    }))

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