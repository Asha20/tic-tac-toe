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
                return Box.boxes[i];
            }
        }
    }

    Box.prototype.draw = function(ctx) {
        let centerX = this.x + this.size / 2;
        let centerY = this.y + this.size / 2;
        let offset = this.size * 0.3;

        ctx.strokeStyle = "black";
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
    }

    let game = {
        init: function() {
            this.opponent = "player";
        },

        makeTurn: function(event) {
            if (this.turn === undefined) {
                this.turn = "o";
            }
            let selected = Box.checkCollision(event.layerX, event.layerY);

            if (selected.fill !== "e") {
                return;
            }
            
            selected.fill = this.turn;
            this.turn = this.turn === "o" ? "x" : "o";
            canvas.update();
        }
    };

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

    game.init();
    canvas.init();
    canvas.element.addEventListener("click", game.makeTurn);

})(window);