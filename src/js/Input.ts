import { Board } from "./Board";
import $ from "jquery";
export class Input {

    static DEBUG = false;

    board: Board;
    listening: {
        keydown: boolean,
        swipe: boolean
    }

    /**
     * constructs Input instance that listens for key changes or swipes and sends them to a board
     * @param board the board instance to send signals to
     */
    constructor(board: Board) {
        this.board = board;   
        this.listening = {
            keydown: false,
            swipe: false
        };
        this.listenForKeyDown();
        this.listenForSwipe();
    }

    /**
     * a one time function that begins the listening for keydown events
     * @returns a reference to the Input instance
     */
    listenForKeyDown(): Input {
        if (this.listening.keydown) return this;
        this.listening.keydown = true;
        $(window).on("keydown", ev => {
            ev.preventDefault();
            
            let move: "LEFT" | "DOWN" | "RIGHT" | "UP" | null = null;
            switch (ev.code) {
                case "KeyA":
                case "ArrowLeft":
                    move = "LEFT";
                    break;
                case "KeyS":
                case "ArrowDown":
                    move = "DOWN";
                    break;
                case "KeyD":
                case "ArrowRight":
                    move = "RIGHT";
                    break;
                case "KeyW":
                case "ArrowUp":
                    move = "UP";
                    break;
                default: break;
            }

            if (move)
                this.trigger(move)
                    .then((res: string) => {
                        if (Input.DEBUG)
                            console.log(res);
                    }).catch(reason => {
                        if (Input.DEBUG)
                            console.log(reason);
                    });
        });
        return this;
    }

    /**
     * a one time function that begins the listening for swiping events
     * @returns a reference to the Input instance
     */
    listenForSwipe(): Input {
        if (this.listening.swipe) return this;
        this.listening.swipe = true;

        let touchStarted = false;
        let original: [number, number] = [0, 0];
        const htmlNode: JQuery = this.board.$front;
        htmlNode.on("touchstart", ev => {
            ev.preventDefault();
            if (touchStarted) return;
            if (ev.touches.length < 1) return; 
            touchStarted = true;
            
            const touch = ev.touches[0];
            original = [touch.clientX, touch.clientY];
        });
        htmlNode.on("touchend", ev => {
            ev.preventDefault();
            if (!touchStarted) return;
            if (ev.changedTouches.length < 1) return;
            const touch = ev.changedTouches[0];

            this._analyzeTouch(original, [touch.clientX, touch.clientY]);

            touchStarted = false;
        });
        htmlNode.on("touchcancel", ev => {
            ev.preventDefault();
            touchStarted = false;
        });
        return this;
    }

    get TOUCH_DIST_THRESHOLD(): number {
        return (this.board.$front.width() || 400) / 4;
    }

    /**
     * analyzes the touch event and fires a move if deemed appropiate
     * @param original the XY coordinates where the touch started
     * @param now the XY coordinates where the touch ended
     */
    _analyzeTouch(original: [number, number], now: [number, number]): void {
        const dist: number = Math.sqrt((original[0] - now[0])**2 + (original[1] - now[1])**2);
        if (dist < this.TOUCH_DIST_THRESHOLD) return;

        now[0]-= original[0];
        now[1]-= original[1];

        const angle: number = Math.atan2(now[1], now[0]);
        this.trigger(
            angle > 3*Math.PI/4 || angle <= -3*Math.PI/4 ? "LEFT" :
            angle <= 3*Math.PI/4 && angle > Math.PI/4 ? "DOWN" :
            angle <= Math.PI/4 && angle > -Math.PI/4 ? "RIGHT" :
            "UP"
        ).then((res: string) => {
            if (Input.DEBUG)
                console.log(res);
        }).catch(reason => {
            if (Input.DEBUG)
                console.log(reason);
        });
    }

    /**
     * sends a signal to the board instance indicating the user's choice of move
     * @param move the move signal to send to the board
     * @returns a Promise that resolves upon the completetion of the move or rejects when the board is busy
     */
    async trigger(move: "UP" | "DOWN" | "LEFT" | "RIGHT"): Promise<string> {
        return this.board.shift(move);
    }

}