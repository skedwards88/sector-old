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

export function calculateScore(color, board) {
    // Turn into regular objects instead of Quadrants
    let boardCopy = JSON.parse(JSON.stringify(board));

    let clusters = findClusters(color, boardCopy);

    let scores = clusters.map(cluster => cluster.score);

    return Math.max(...scores)
}
