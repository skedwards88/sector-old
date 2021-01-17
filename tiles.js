export class Quadrant {
    constructor({ color, symbol }) {
        this.color = color;
        this.symbol = symbol;
    }
}

export class Tile {
    constructor({ quadrants }) {
        this.quadrants = quadrants;
    }
}

export const tiles = [
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
                    color: "red",
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
                    color: "green",
                    symbol: null
                }),
                new Quadrant({
                    color: "green",
                    symbol: null
                })
            ],
            [
                new Quadrant({
                    color: "green",
                    symbol: null
                }),
                new Quadrant({
                    color: "green",
                    symbol: null
                })
            ]
        ]
    }),



]