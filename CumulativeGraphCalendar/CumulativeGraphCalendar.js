let Simulation = function() {
    this.graphics = new Nabla.Canvas2D(document.getElementById('canvas'), [[-0.05, 1.05], [-0.05, 1.05]]);
    this.nImage = Nabla.ImageIO.loadImage("n.png");
    this.cnImage = Nabla.ImageIO.loadImage("c(n).png");
    this.needDraw = true;
    this.mouseInSpace = [];
    let calendarData = JSON.parse(window.localStorage[window.location.search.substring(1)]);
    let valuesStream = Nabla.Stream.of(calendarData)
                                   .flatMap(x => Nabla.Stream.of(Object.values(x.days)));
    this.cumulateValues = valuesStream.reduce([0], (e, v) => {
        e.push(e[e.length-1] + v);
        return e;
    })
}

function getDashedLineShader(color) {
    return Nabla.Canvas.interpolateLineShader(
        (x, line, canvas, t) => {
            var p = 0.1;
            var isDash = (t % p) < (p / 2) ? true : false;
            if (isDash) {
                canvas.drawPxl(x, color);
            }
        });
};

function getStringShader() {
    return ctx => {
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
    }
}

function getRandomShader(color) {
    return (x, element, canvas) => {
        let y = canvas.inverseTransform(x);
        let b = x[0] % 2 == x[1] % 2;
        if(b) canvas.drawPxl(x, color);
    }
}

Simulation.prototype.baseMouseAction = function(mouse) {
    this.needDraw = true;
    this.mouseInSpace = this.graphics.inverseTransform(mouse);
}

Simulation.prototype.mouseMove = function(e) {
    let rect = this.graphics.canvas.getBoundingClientRect();
    let mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
    this.baseMouseAction([my, mx]);
}


Simulation.prototype.touchMove = function(e) {
    let rect = this.graphics.canvas.getBoundingClientRect();
    let mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
    this.baseMouseAction([my, mx]);
}

Simulation.prototype.reSizeCanvas = function() {
    this.graphics.canvas.width = document.body.offsetWidth;
    this.graphics.canvas.height = document.body.offsetHeight;
}

Simulation.prototype.init = function() {
    this.reSizeCanvas();
    this.graphics.canvas.addEventListener("mousemove", e => this.mouseMove(e), false);
    this.graphics.canvas.addEventListener("touchmove", e => this.touchMove(e), false);
}

Simulation.prototype.simulate = function() {
    this.init();
    requestAnimationFrame(() => this.draw());
}

Simulation.prototype.drawBackGround = function() {
    this.graphics.drawLine([-1, 0], [1, 0], Nabla.Canvas.simpleShader([0, 0, 0, 255]));
    this.graphics.drawLine([0, -1], [0, 1], Nabla.Canvas.simpleShader([0, 0, 0, 255]));
    this.graphics.drawImage(this.nImage, [1, -0.02]);
    this.graphics.drawImage(this.cnImage, [-0.05, 1]);
}

Simulation.prototype.drawCumulativeGraph = function() {
    let color = [0, 255, 0, 255];
    let n = this.cumulateValues.length - 1;
    let h = 1 / (n - 1);
    for (let i = 0; i < n; i++) {
        let x = i / (n - 1);
        let y = this.cumulateValues[i] / n;
        let yh = this.cumulateValues[i+1] / n;
        this.graphics.drawLine([x, y], [x + h, yh], Nabla.Canvas.simpleShader(color));
        this.graphics.drawQuad([x, 0], [x + h, 0], [x + h, yh], [x, y], getRandomShader(color));
    }
}

Simulation.prototype.mouseDraw = function() {
    if(!this.mouseInSpace || this.mouseInSpace.length == 0) return;
    let n = this.cumulateValues.length - 1;
    var x = this.mouseInSpace[0];
    x = Math.max(Math.min(x, 1), 0);
    let index = Math.floor(x * (n - 1));
    let y = this.cumulateValues[index] / n;
    this.graphics.drawCircle([x, y], 0.005, Nabla.Canvas.simpleShader([255, 0, 0, 255]));
    this.graphics.drawLine([x, 0], [x, y], getDashedLineShader([255, 0, 0, 255]));
    this.graphics.drawString([x, -0.05], `${x.toFixed(2)}`, getStringShader());
    this.graphics.drawLine([0, y], [x, y], getDashedLineShader([255, 0, 0, 255]));
    this.graphics.drawString([-0.05, y], `${y.toFixed(2)}`, getStringShader());
}

Simulation.prototype.draw = function() {
    if(this.needDraw) {
        this.reSizeCanvas();
        this.graphics.clearImage([255, 255, 255, 255]);
        this.drawBackGround();
        this.drawCumulativeGraph();
        this.mouseDraw();
        this.graphics.paintImage();
        this.needDraw = false;
    }
    requestAnimationFrame(() => this.draw());
}

new Simulation().simulate();