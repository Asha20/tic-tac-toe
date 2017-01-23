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

    let canvas = {
        init: function() {
            this.element = document.querySelector("canvas");
            this.ctx = this.element.getContext("2d");
            this.size = this.element.scrollWidth;
            this.element.width = this.size;
            this.element.height = this.size;
            this.boxSize = this.size * 0.33334;

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
            let drawRect = (box) => this.ctx.fillRect(box.x, box.y,
                                                      box.size, box.size);

            for (let i = 0; i < Box.boxes.length; i++) {
                this.ctx.fillStyle = "white";
                drawRect(Box.boxes[i]);
            }
        },

        update: function() {
            this.drawBoxes();
            this.drawGrid();
        }
    }

    canvas.init();
    canvas.element.addEventListener("click", function(event) {
        let a = Box.checkCollision(event.layerX, event.layerY);
    });

})(window);