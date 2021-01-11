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


}
