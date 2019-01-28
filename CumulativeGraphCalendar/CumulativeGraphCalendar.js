let Simulation = function() {
    this.graphics = new Nabla.Canvas2D(document.getElementById('canvas'), [[-0.05, 1.05], [-0.05, 1.05]]);
    this.nImage = Nabla.ImageIO.loadImage("n.png");
    this.cnImage = Nabla.ImageIO.loadImage("c(n).png");
    this.mouse = [0, 0];
    let calendarData = JSON.parse(window.localStorage[window.location.search.substring(1)]);
    let valuesStream = Nabla.Stream.of(calendarData)
                                   .flatMap(x => Nabla.Stream.of(Object.values(x.days)))
                                   .map(x => Math.random());
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

Simulation.prototype.baseMouseAction = function(mouse) {
    let mouseInSpace = this.graphics.inverseTransform(mouse);
    this.graphics.drawCircle(mouseInSpace, 0.05, Nabla.Canvas.simpleShader([255,0,0,255]));
    this.graphics.drawLine([mouseInSpace[0], 0], [0, mouseInSpace[1]], getDashedLineShader([255, 0, 0, 255]));
    this.graphics.drawLine([0, mouseInSpace[1]], [mouseInSpace[0], 0], getDashedLineShader([255, 0, 0, 255]));
}

Simulation.prototype.mouseMove = function(e) {
    let rect = this.graphics.canvas.getBoundingClientRect();
    let mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
    this.mouse[0] = my;
    this.mouse[1] = mx;
    this.baseMouseAction(this.mouse);
}


Simulation.prototype.touchMove = function(e) {
    let rect = this.graphics.canvas.getBoundingClientRect();
    let mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
    this.mouse[0] = my;
    this.mouse[1] = mx;
    this.baseMouseAction(this.mouse);
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
    let n = this.cumulateValues.length - 1;
    let h = 1 / (n - 1);
    for (let i = 0; i < n; i++) {
        let x = i / (n - 1);
        let y = this.cumulateValues[i] / n;
        let yh = this.cumulateValues[i+1] / n;
        this.graphics.drawLine([x, y], [x + h, yh], Nabla.Canvas.simpleShader([0,255,0,255]));
    }
}

Simulation.prototype.draw = function() {
    console.log("drawing");
    this.reSizeCanvas();
    this.graphics.clearImage([255, 255, 255, 255]);
    this.drawBackGround();
    this.drawCumulativeGraph();
    this.graphics.paintImage();
    requestAnimationFrame(() => this.draw());
}

new Simulation().simulate();