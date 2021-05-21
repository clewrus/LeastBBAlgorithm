const TASK =
    "На заданій множині з N точок побудувати чотирикутник найменшої площі,\
 який би охоплював задану множину."

const AUTHOR = "Author: Saitarly Oleksii";

const POINT_R = 7;
const NUM_OF_RAND_POINTS = 10;

let clearButton;
let genRandomButton;
let solveButton;
let nextRectButton;
let enumerateButton;

let controller;
let points = [];
let currentHull;
let currentRect;

function setup() {
    initializeButtons();

    let canvas = createCanvas(windowWidth - 50, windowHeight - 50);
    canvas.mouseClicked(addMousePoint);

    initializeController();
}

function draw() {
    background(230);

    drawPoints();
    drawHull();

    drawRect();
}

function addMousePoint() {
    let mousePoint = createVector(mouseX, mouseY);
    points.push(mousePoint);
}

function initializeController() {
    const hull = new HullEvaluator();
    const rect = new RectEnumerator();
    const alg = new LeastBBFinder();

    controller = new LabController(hull, rect, alg)
}

function initializeButtons() {
    createButton("The task").style("position", "absolute").style("top", 10).style("left", 10).mouseClicked(() => alert(TASK));
    createButton("Author").style("position", "absolute").style("top", 40).style("left", 10).mouseClicked(() => alert(AUTHOR));

    solveButton = createButton("Solve");
    solveButton.mouseClicked(onSolveClicked);

    enumerateButton = createButton("Enumerate rects");
    enumerateButton.mouseClicked(onStartRectsEnumeration);

    nextRectButton = createButton("Next rect");
    nextRectButton.mouseClicked(onNextClicked);

    genRandomButton = createButton("Generate random cloud");
    genRandomButton.mouseClicked(onGenRandomClicked);

    clearButton = createButton("Clear");
    clearButton.mouseClicked(onClearClicked);
}

function onSolveClicked() {
    currentHull = controller.findHull(points);
    currentRect = controller.solveForPoints(points);
}

function onStartRectsEnumeration() {
    controller.startRectEnumeration(points);
    onNextClicked();
}

function onNextClicked() {
    currentRect = controller.getNextRect();
}

function onGenRandomClicked() {
    for (let i = 0; i < NUM_OF_RAND_POINTS; i++) {
        let dir = p5.Vector.random2D();
        let length = random(0.3 * width);

        let randPos = dir.mult(length).add(width / 2, height / 2);
        points.push(randPos);
    }
}

function onClearClicked() {
    points.length = 0;
    currentHull = null;
    currentRect = null;
}

function drawPoints() {
    noStroke();
    fill(240, 20, 20);

    points.forEach(pos => ellipse(pos.x, pos.y, POINT_R));
}

function drawHull() {
    if (!(currentHull instanceof Array)) { return; }
    if (currentHull.length <= 1) { return; }

    for (let i = 0; i < currentHull.length - 1; i++) {
        drawHullEdge(currentHull[i], currentHull[(i + 1)])
    }

    drawHullEdge(currentHull[0], currentHull[currentHull.length - 1]);
}

function drawHullEdge(v1, v2) {
    stroke(0);
    strokeWeight(2);

    line(v1.x, v1.y, v2.x, v2.y);
}

function drawRect() {
    if (currentRect == null) { return; }
    drawHullEdge(currentRect.min, currentRect.minMax);
    drawHullEdge(currentRect.minMax, currentRect.max);
    drawHullEdge(currentRect.max, currentRect.maxMin);
    drawHullEdge(currentRect.maxMin, currentRect.min);
}