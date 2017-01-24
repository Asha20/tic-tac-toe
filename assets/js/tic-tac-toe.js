let ticTacToe = (function(global) {
    function Box(x, y, size, fill) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.fill = fill || "e";
    }
    Box.boxes = [];

    Box.checkCollision = function(x, y) {
        for (let i = 0; i < Box.boxes.length; i++) {
            let box = Box.boxes[i];
            if (x > box.x && x < (box.x + box.size) &&
                y > box.y && y < (box.y + box.size)) {
                return i;
            }
        }
    };

    Box.clear = function() {
        for (let i = 0; i < Box.boxes.length; i++) {
            Box.boxes[i].fill = "e";
        }
        canvas.update();
    };

    Box.isFull = function() {
        return Box.boxes.every((element) => element.fill !== "e");
    }

    Box.display = function() {
        let output = ""
        for (let i = 0; i < 3; i++) {
            let a = i * 3;
            let line = Box.boxes[a].fill +
                         Box.boxes[a + 1].fill +
                         Box.boxes[a + 2].fill;
            output += line + "\n";
        }
        console.log(output);
    };

    Box.prototype.draw = function(ctx, winning) {
        let centerX = this.x + this.size / 2;
        let centerY = this.y + this.size / 2;
        let offset = this.size * 0.3;

        ctx.strokeStyle = winning ? "red" : "black";
        ctx.lineWidth = 5;
        if (this.fill === "x") {
            ctx.beginPath();
            ctx.moveTo(centerX - offset, centerY + offset);
            ctx.lineTo(centerX + offset, centerY - offset);
            ctx.moveTo(centerX + offset, centerY + offset);
            ctx.lineTo(centerX - offset, centerY - offset);
            ctx.stroke();
        }
        else if (this.fill === "o") {
            ctx.beginPath();
            ctx.arc(centerX, centerY, offset, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else if (this.fill === "e") {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    };

    let game = (function() {
        let opponent = "player";
        let turn = "o";
        let pause = false;

        let winConditions = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        function makeTurn(event) {
            if (pause) {
                Box.clear();
                pause = false;
                return;
            }

            let selected = Box.checkCollision(event.layerX, event.layerY);
            if (Box.boxes[selected].fill !== "e") {
                return;
            }
            
            Box.boxes[selected].fill = turn;
            turn = turn === "o" ? "x" : "o";

            if (!victory()) {
                if (Box.isFull()) {
                    endGame();
                }
                canvas.update();
            }
        };

        function endGame(winner, winBoxes) {
            turn = "o";
            if (winBoxes !== undefined) {
                for (let i = 0; i < winBoxes.length; i++) {
                    winBoxes[i].draw(canvas.ctx, true);
                }
            }

            pause = true;
            console.log(winner, "won!");
        }

        // Finish this
        function victory() {
            for (let i = 0; i < winConditions.length; i++) {
                let winBoxes = [];
                for (let j = 0; j < winConditions[i].length; j++) {
                    let position = winConditions[i][j];
                    if (Box.boxes[position].fill === "e") {
                        break;
                    }
                    winBoxes.push(Box.boxes[position]);
                }
                if (winBoxes.length === 3 &&
                    winBoxes.every((element) => element.fill === "o")) {
                    endGame("o", winBoxes);
                    return true;
                }
                else if (winBoxes.length === 3 &&
                         winBoxes.every((element) => element.fill === "x")) {
                    endGame("x", winBoxes);
                    return true;
                }
            }
            return false;
        };

        return {
            turn: turn,
            makeTurn: makeTurn
        }
    })();

    let canvas = {
        init: function() {
            this.element = document.querySelector("canvas");
            this.ctx = this.element.getContext("2d");
            this.size = this.element.scrollWidth;
            this.element.width = this.size;
            this.element.height = this.size;
            this.boxSize = Math.floor(this.size * 0.33334);

            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 3; x++) {
                    Box.boxes.push(new Box(this.boxSize * x,
                                           this.boxSize * y,
                                           this.boxSize));
                }
            }

            this.update();
        },

        drawGrid: function() {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "black";

            for (let i = 1; i <= 2; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.boxSize * i, 0);
                this.ctx.lineTo(this.boxSize * i, this.size);
                this.ctx.stroke();

                this.ctx.moveTo(0, this.boxSize * i);
                this.ctx.lineTo(this.size, this.boxSize * i);
                this.ctx.stroke();
            };
        },

        drawBoxes: function() {
            for (let i = 0; i < Box.boxes.length; i++) {
                Box.boxes[i].draw(this.ctx);
            }
        },

        update: function() {
            this.drawBoxes();
            this.drawGrid();
        }
    }

    canvas.init();
    canvas.element.addEventListener("click", game.makeTurn);
})(window);