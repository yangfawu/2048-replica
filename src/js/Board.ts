import { Tile } from "./Tile";
import $ from "jquery";
export type BoardIndex = 0 | 1 | 2 | 3;
export class Board {

    static DELAY = 0; // ms
    static ANIMATION_TIME = 1000*Tile.ANIMATION_TIME + Board.DELAY; // ms

    tiles: (Tile | null)[];
    state: "IDLE" | "BUSY";
    $front: JQuery;
    over: {
        text: JQuery,
        button: JQuery
    };
    $over: JQuery;
    node: JQuery;
    score: [{ node: JQuery, value: number }, { node: JQuery, value: number }];

    /**
     * constructs a new instance of Board that have empty tiles
     */
    constructor() {
        this.tiles = new Array<Tile | null>(16);
        this.state = "IDLE";

        const scoreNode = () => ({ 
            node: $(`<span>`)
                .css("transition", `transform ${Tile.ANIMATION_TIME}s, color ${Tile.ANIMATION_TIME}s`)
                .text(0), 
            value: 0 });
        this.score = [scoreNode(), scoreNode()];
        
        const $back = $(`<div class="back">`);
        for (let i=0; i<16; i++)
            $back.append(`<div>`);
        this.$front = $(`<div class="front">`);

        const resetFunc = () => {
            this.reset();
        };
        this.over = {
            text: $("<p>").text("Game over!"),
            button: $("<button>").text("Try again").on("click", resetFunc)
        }
        this.$over = $(`<div class="over">`).append(
            ...Object.values(this.over)
        ).fadeOut(0);
        this.node = $(`<section class="ui">`).append(
            $(`<div class="header">`).append(
                $("<div>").append(
                    $("<h1>").text("2048"),
                    $("<p>").html(`Join the tiles, get to <a href="https://play2048.co/" target="_blank">2048!</a>`),
                    $("<p>").text("Replicated from scratch by Yangfa")
                ),
                $("<div>").append(
                    $("<div>").append(
                        $("<div>").append(
                            $("<h1>").text("score"),
                            this.score[0].node
                        ),
                        $("<div>").append(
                            $("<h1>").text("best"),
                            this.score[1].node
                        )
                    ),
                    $("<button>").text("New Game").on("click", resetFunc)
                )
            ),
            $(`<div class="board">`).append(
                $back,
                this.$front,
                this.$over
            ),
            $("<p>").html(`All the colors and general formatting were sourced from <a href="https://play2048.co/" target="_blank">here</a>. Everything else in this project is built from scratch using node_modules, TS, and SCSS. Have fun.`)
        );

        this.reset();
    }

    /**
     * sets the current score or high score to specified score
     * @param target an index indicating if you are editting high score or current score
     * @param score the new score the target will have
     * @returns a reference to the Board instance
     */
    setScore(target: 0 | 1, score: number): Board {
        const ref = this.score[target];
        if (ref.value != score) {
            ref.value = score;
            ref.node.text(ref.value).css({
                "transform": "scale(1.2)",
                "color": "#dddddd"
            });
            setTimeout(() => {
                ref.node.css({
                    "transform": "scale(1)",
                    "color": "white"
                });
            }, Board.ANIMATION_TIME);
        }
        return this;
    }

    /**
     * adds a specified amount of points to the current score
     * @param amount the amount of points to add to current score
     * @returns a reference to the Board instance
     */
    addScore(amount: number): Board {
        this.setScore(0, this.score[0].value + amount);
        return this._normalizeScores();
    }

    /**
     * makes sure that the high score is up to date with current score
     * @returns a reference to the Board instance
     */
    _normalizeScores(): Board {
        if (this.score[0].value > this.score[1].value)
            this.setScore(1, this.score[0].value);
        return this;
    }

    /**
     * removes all numbered-tiles from the board
     */
    empty(): Board {
        for (let i=0; i<this.tiles.length; i++)
            this.tiles[i] = null;
        this.$front.empty();
        return this;
    }

    /**
     * adds a tile with desired power into the board if possible
     * @param power the power of the new tile
     */
    addTileRandomly(power = 1): Board {
        const options: number[] = this.emptyTileIndexes;
        if (options.length > 0) {
            const index = options[Math.floor(Math.random() * options.length)];
            const row: BoardIndex = Math.floor(index / 4) as BoardIndex;
            const col: BoardIndex = (index % 4) as BoardIndex;
            const tile: Tile = new Tile(row, col, power);
            this.$front.append(tile.node);
            this.tiles[index] = tile;
        }
        return this;
    }

    static chanceOf4 = 0.7;

    /**
     * adds a new tile with a power of 1 or 2 to an empty slot on the board randomly
     * @param freq the number of random tiles to add
     * @returns a reference of the Board instance for chaining
     */
    addRandomTile(freq = 1): Board {
        for (let i=0; i<freq; i++)
            this.addTileRandomly(Math.random() > Board.chanceOf4 ? 2 : 1);
        return this; 
    }

    /**
     * @returns the board tiles in an array of rows from top to bottom
     */
    get rows(): (Tile | null)[][] {
        const out: (Tile | null)[][] = new Array<(Tile | null)[]>(4);
        for (let i=0; i<out.length; i++) {
            const row: (Tile | null)[] = new Array<Tile | null>(4);
            for (let j=0; j<4; j++)
                row[j] = this.tiles[i*4 + j];
            out[i] = row;
        }
        return out;
    }

    /**
     * @returns the board tiles in an array of columns from left to right
     */
    get cols(): (Tile | null)[][] {
        const out: (Tile | null)[][] = new Array<(Tile | null)[]>(4);
        for (let i=0; i<out.length; i++) {
            const col: (Tile | null)[] = new Array<Tile | null>(4);
            for (let j=0; j<4; j++)
                col[j] = this.tiles[j*4 + i];
            out[i] = col;
        }
        return out;
    }

    /**
     * @param index the index corresponding to the specific row you want to get
     * @returns the row corresponding to the given index
     */
    getRow(index: BoardIndex): (Tile | null)[] {
        return this.rows[index];
    }

    /**
     * @param index the index corresponding to the specific column you want to get
     * @returns the column corresponding to the given index
     */
    getCol(index: BoardIndex): (Tile | null)[] {
        return this.cols[index];
    }

    /**
     * @param index the index corresponding to the tile you want to get (order: left to right, top to bottom)
     * @returns the corresponding tile at given index
     */
    getTileFlatly(index: number): (Tile | null) {
        if (index < 0 || index >= this.tiles.length) return null;
        return this.tiles[index];  
    }

    /**
     * @param row the row index corresponding to the specific row you want to access (order: top to bottom)
     * @param col the column index corresponding to the specific column you want to access (order: left to right)
     * @returns the corresponding tile at given coordinates
     */
    getTile(row: BoardIndex, col: BoardIndex): (Tile | null) {
        return this.tiles[row*4 + col];
    }

    /**
     * @param group a collection of tiles
     * @returns whether or not there is any consecutive tile with the same values within the same group (nulls don't count)
     */
    _isGroupCollapsable(group: (Tile | null)[]): boolean {
        for (let i=1; i<group.length; i++)
            if (group[i]?.equals(group[i - 1]))
                return true;
        return false;
    }

    /**
     * @returns an array of all the indexes corresponding to rows that can be collapsed
     */
    get collapsableRows(): BoardIndex[] {
        const out: BoardIndex[] = [];
        for (let i=0; i<this.rows.length; i++) {
            const row = this.rows[i];
            if (this._isGroupCollapsable(row))
                out.push(i as BoardIndex);
        }
        return out;            
    }

    /**
     * @returns an array of all the indexes corresponding to columns that can be collpased
     */
    get collapsableCols(): BoardIndex[] {
        const out: BoardIndex[] = [];
        for (let i=0; i<this.cols.length; i++) {
            const col = this.cols[i];
            if (this._isGroupCollapsable(col))
                out.push(i as BoardIndex);
        }
        return out;  
    }

    /**
     * @returns whether or not any of the rows can be collapsed
     */
    get isRowsCollapsable(): boolean {
        return this.collapsableRows.length > 0;
    }

    /**
     * @returns whether or not any of the columns can be collapsed
     */
    get isColsCollapsable(): boolean {
        return this.collapsableCols.length > 0;
    }

    /**
     * @returns whether or not anything can be collapsed
     */
    get isCollapsable(): boolean {
        return this.isRowsCollapsable || this.isColsCollapsable;
    }

    /**
     * @returns a 2D array where the first array contains all the tile indexes of filled in tiles and the second array contains all the other indexes
     */
    get _sortedFlatIndexes(): number[][] {
        const out: number[][] = [[], []];
        for (let i=0; i<this.tiles.length; i++)
            out[this.tiles[i] ? 0 : 1].push(i); 
        return out;
    }

    /**
     * @returns an array of all the tile indexes of filled tiles
     */
    get filledTileIndexes(): number[] {
        return this._sortedFlatIndexes[0];
    }

    /**
     * @returns an array of all the tile indexes of empty tiles
     */
    get emptyTileIndexes(): number[] {
        return this._sortedFlatIndexes[1];
    }

    /**
     * @returns a random index of a board tile that does not have a tile already
     */
    get randomOpenIndex(): number {
        const open: number[] = this.emptyTileIndexes;
        if (open.length < 1) return -1;
        return open[Math.floor(Math.random()*open.length)];
    }

    /**
     * @returns whether or not there is a tile with a value of 2048
     */
    get isCompleted(): boolean {
        return this.tiles.findIndex(tile => tile && tile.value >= 2048) > -1;
    }

    /**
     * @returns whether or not more tiles can be added
     */
    get isFull(): boolean {
        return this.emptyTileIndexes.length == 0;
    }

    /**
     * @returns whether or not the board has reached a dead end
     */
    get isUnbeatable(): boolean {
        return this.isFull && !this.isCollapsable;
    }

    /**
     * @returns a clean 4x4 board with no numbered-tiles
     */
    static _generateEmptyMap(): (Tile | null)[][] {
        const out: (Tile | null)[][] = new Array<(Tile | null)[]>(4);
        for (let i=0; i<4; i++) {
            const row: (Tile | null)[] = [];
            for (let j=0; j<4; j++)
                row[j] = null;
            out[i] = row;
        }
        return out;
    }

    /**
     * collapses all the rows/cols of the board in the given directon
     * @param target a string specifying which dimension to squash
     * @param ascending whether or not the algorithm should squash left-to-right/top-to-bottom or the opposite
     * @returns a reference to the Board instance for chaining
     */
    _collapse(target: "rows" | "cols", ascending = true): Board {
        const newGroups: (Tile | null)[][] = Board._generateEmptyMap();
        const currGroups: Tile[][] = [...this[target]].map(group => group.filter(tile => tile != null)) as Tile[][];
        for (let i=0; i<currGroups.length; i++) {
            const group: Tile[] = currGroups[i];
            let fillIndex = ascending ? 3 : 0;
            while (group.length > 0) {
                const currentIdx = ascending ? group.length - 1 : 0 ;
                const current: Tile = group[currentIdx];
                if (group.length > 1) {
                    const adjacentIdx = ascending ? group.length - 2 : 1;
                    const adjacent: Tile = group[adjacentIdx];
                    if (current.equals(adjacent)) {
                        current.upgrade();
                        this.addScore(current.value);
                        adjacent.remove();
                        group.splice(adjacentIdx, 1);
                    }
                }
                newGroups[i][fillIndex] = current;
                if (ascending) {
                    fillIndex--;
                    group.pop();
                } else {
                    fillIndex++;
                    group.shift();
                }
            }
        }
        for (let i=0; i<this.tiles.length; i++) {
            const row: BoardIndex = Math.floor(i / 4) as BoardIndex;
            const col: BoardIndex = (i % 4) as BoardIndex;
            const tile: Tile | null = target == "rows" ? newGroups[row][col] : newGroups[col][row];
            this.tiles[i] = tile ? tile.changeCoord(row, col) : null;
        }
        return this;
    }

    /**
     * collapses all the rows of the board in the given directon
     * @param target a string specifying which dimension to squash
     * @param ascending whether or not the algorithm should squash left-to-right/top-to-bottom or the opposite
     * @returns a reference to the Board instance for chaining
     */
    collapse(target: "rows" | "cols", ascending = true): Board {
        const oldPrint: string = this.flatPrint;
        this._collapse(target, ascending);
        const newPrint: string = this.flatPrint;
        if (newPrint != oldPrint && !this.isFull) {
            this.addRandomTile();
            if (this.isUnbeatable || this.isCompleted) {
                this.over.text.text("Game over!");
                this.over.button.text("Try again");
                if (this.isCompleted) {
                    this.over.text.text("You win!");
                    this.over.button.text("Replay");
                }
                this.$over.fadeIn(500);
            }
        }
        return this;
    }

    /**
     * @returns a flat map of all the tiles in the Board instance
     */
    get flatMap(): (Tile | null)[] {
        return this.tiles;
    }

    /**
     * @returns an immutable snap of what all the tile's values are
     */
    get flatPrint(): string {
        const src: (null | number)[] = [];
        for (let i=0; i<this.tiles.length; i++) {
            const tile: (null | Tile) = this.tiles[i];
            src.push(tile ? tile.value : null);
        }
        return src.join("-");
    }

    /**
     * collapses the board with the given direction
     * @param move the direction indicating how the board should be collapsed
     */
    shift(move: "LEFT" | "RIGHT" | "UP" | "DOWN"): Promise<string> {
        if (this.state == "BUSY")
            return new Promise<string>((resolve, reject) => {
                reject("The board is currently busy executing another move.")
            });
        if (this.isUnbeatable || this.isCompleted)
            return new Promise<string>((resolve, reject) => {
                this.over.text.text("Game over!");
                this.over.button.text("Try again");
                if (this.isCompleted) {
                    this.over.text.text("You win!");
                    this.over.button.text("Replay");
                }
                this.$over.fadeIn(500);
                reject("The game is over.");
            });
        this.state = "BUSY";
        return new Promise<string>((resolve) => {
            if (move == "RIGHT" || move == "LEFT")
                this.collapse("rows", move == "RIGHT");
            else
                this.collapse("cols", move == "DOWN");
            setTimeout(() => {
                this.state = "IDLE";
                resolve( move + " move executed.");
            }, Board.ANIMATION_TIME);
        });
    }

    /**
     * resets the board so a new game can be played
     */
    reset(): Board {
        this._normalizeScores()
            .setScore(0, 0)
            .empty()
            .$over.fadeOut(500, () => {
                this.addRandomTile(2);
            });
        return this;
    }

}