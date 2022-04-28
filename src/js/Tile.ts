import { BoardIndex } from "./Board";
import $ from "jquery";

export class Tile {

    static ANIMATION_TIME = 0.1;

    _power: number;
    before: [BoardIndex, BoardIndex]; // [row, col]
    now: [BoardIndex, BoardIndex]; // [row, col]
    node: JQuery<HTMLElement>;

    /**
     * constructs a Tile instance that represents valuable tile in 2048
     * @param power a non-negative integer representing an exponent of 2
     */
    constructor(row: BoardIndex, col: BoardIndex, power = 1) {
        this._power = power;
        this.before = [ row, col ];
        this.now = [ row, col ];

        const timeString = `${Tile.ANIMATION_TIME}s`;
        this.node = $(`<div>`).addClass("tile")
                            .attr("data-value", 0)
                            .css("transition", ["top", "left", "transform"].join(` ${timeString}, `) + ` ${timeString}`);
        this._compile();
    }

    /**
     * @returns a non-negative integer representing an exponent of 2
     */
    get power(): number {
        return this._power;
    }

    /**
     * @returns a power of two that the tile is currently representing
     */
    get value(): number {
        return 2**this._power;
    }

    /**
     * @param other another instance of Tile
     * @returns whether or not this tile and the other tile has the same value
     */
    equals(other: Tile | null): boolean {
        return this.value == other?.value;
    }

    static get spacing(): string {
        return "15px";
    }

    /**
     * (re)compiles the Tile instance's HTML represenation
     * @returns a reference to this Tile instance for chaining
     */
    _compile(): Tile {
        const padding = Tile.spacing;
        const size = `calc(25% - calc(0.75 * ${padding}))`;
        const origin = `calc(${size} / 2)`;
        const form = (idx: 0 | 1) => `calc(${origin} + ${this.now[idx]}*${size} + ${this.now[idx]}*${padding})`;
        this.node.text(this.value)
            .attr("data-value", this.value)
            .css({
                top: form(0),
                left: form(1)
            });
        return this;
    }

    /**
     * increases the tile's power and automatically recompiles its HTML representation
     * @returns a reference to this Tile instance for chaining
     */
    upgrade(): Tile {
        this._power++;
        this._compile();
        this.node.css("transform", "translate(-50%, -50%) scale(1.2)");
        setTimeout(() => {
            this.node.css("transform", "translate(-50%, -50%) scale(1)");
        }, Tile.ANIMATION_TIME * 1000);
        return this;
    }

    /**
     * sets the new coordinates of the tile
     * @param newRow the new row index where this tile will be placed
     * @param newCol the new column index where this tile will be placed
     * @returns a reference to this Tile instance for chaining
     */
    changeCoord(newRow: BoardIndex, newCol: BoardIndex): Tile {
        this.before = [...this.now];
        this.now = [newRow, newCol];
        return this._compile();
    }

    /**
     * sets the new column index of the tile
     * @param newCol the new column index where this tile will be placed
     * @returns a reference to this Tile instance for chaining
     */
    changeCol(newCol: BoardIndex): Tile {
        return this.changeCoord(this.now[0], newCol);
    }
    
    /**
     * sets the new row index of the tile
     * @param newRow the new row index where this tile will be placed
     * @returns a reference to this Tile instance for chaining
     */
    changeRow(newRow: BoardIndex): Tile {
        return this.changeCoord(newRow, this.now[1]);
    }

    /**
     * removes its HTML representation from the DOM if it's added
     * @returns a reference to this Tile instance for chaining
     */
    remove(): Tile {
        this.node.remove();
        return this;
    }

    /**
     * @returns the flat index of its old coordinates
     */
    get flatBeforeIndex(): number {
        return this.before[0]*4 + this.before[1];
    }

    /**
     * @returns the flat index of its current coordinates
     */
    get flatNowIndex(): number {
        return this.now[0]*4 + this.now[1];
    }

}