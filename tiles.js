export class Quadrant {
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

export const tiles = [
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
        id: 3,
        quadrants: [
            [
                new Quadrant({
                    color: "blue",
                    symbol: "whirl"
                }),
                new Quadrant({
                    color: "black",
                    symbol: null
                })
            ],
            [
                new Quadrant({
                    color: "black",
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
        id: 4,
        quadrants: [
            [
                new Quadrant({
                    color: "blue",
                    symbol: "moon"
                }),
                new Quadrant({
                    color: "black",
                    symbol: null
                })
            ],
            [
                new Quadrant({
                    color: "red",
                    symbol: "moon"
                }),
                new Quadrant({
                    color: "black",
                    symbol: null
                })
            ]
        ]
    }),

    new Tile({
        id: 5,
        quadrants: [
            [
                new Quadrant({
                    color: "blue",
                    symbol: "planet"
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
                    color: "black",
                    symbol: null
                })
            ]
        ]
    }),

    new Tile({
        id: 6,
        quadrants: [
            [
                new Quadrant({
                    color: "blue",
                    symbol: null
                }),
                new Quadrant({
                    color: "black",
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
        id: 7,
        quadrants: [
            [
                new Quadrant({
                    color: "blue",
                    symbol: "whirl"
                }),
                new Quadrant({
                    color: "red",
                    symbol: "planet"
                })
            ],
            [
                new Quadrant({
                    color: "red",
                    symbol: "moon"
                }),
                new Quadrant({
                    color: "blue",
                    symbol: "star"
                })
            ]
        ]
    }),

    new Tile({
        id: 8,
        quadrants: [
            [
                new Quadrant({
                    color: "black",
                    symbol: null
                }),
                new Quadrant({
                    color: "red",
                    symbol: "star"
                })
            ],
            [
                new Quadrant({
                    color: "blue",
                    symbol: "star"
                }),
                new Quadrant({
                    color: "black",
                    symbol: null
                })
            ]
        ]
    }),

    new Tile({
        id: 9,
        quadrants: [
            [
                new Quadrant({
                    color: "red",
                    symbol: null
                }),
                new Quadrant({
                    color: "black",
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
        id: 10,
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
                    color: "blue",
                    symbol: "moon"
                }),
                new Quadrant({
                    color: "black",
                    symbol: null
                })
            ]
        ]
    }),

    new Tile({
        id: 11,
        quadrants: [
            [
                new Quadrant({
                    color: "black",
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
        id: 12,
        quadrants: [
            [
                new Quadrant({
                    color: "red",
                    symbol: "whirl"
                }),
                new Quadrant({
                    color: "black",
                    symbol: null
                })
            ],
            [
                new Quadrant({
                    color: "blue",
                    symbol: "whirl"
                }),
                new Quadrant({
                    color: "red",
                    symbol: "star"
                })
            ]
        ]
    }),

    new Tile({
        id: 13,
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
                    color: "blue",
                    symbol: null
                }),
                new Quadrant({
                    color: "red",
                    symbol: null
                })
            ]
        ]
    }),
]
