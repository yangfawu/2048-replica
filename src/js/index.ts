import { Board } from "./Board";
import $ from "jquery";
import { Input } from "./Input";

const board: Board = new Board();
const input: Input = new Input(board);

$(document.body).append(board.node);

if (Input.DEBUG)
    console.log(input.board);