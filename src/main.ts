import "./style.css";
//import { LineCommand } from "./draw.ts";
//import { Cursor } from "./draw.ts";
//import { Coordinate } from "./draw.ts";

("use strict");
const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "D2";
const zero = 0;

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.id = "myCanvas";
app.append(canvas);

app.append(document.createElement("br"));

const ctx = canvas.getContext("2d")!;
const commands: LineCommand[] = [];
const redoCommands: LineCommand[] = [];

let cursorCommand: LineCommand | null = null;

const bus = new EventTarget();

function notify(name: string) {
  bus.dispatchEvent(new Event(name));
}

function redraw() {
  ctx.clearRect(zero, zero, canvas.width, canvas.height);

  commands.forEach((cmd) => cmd.execute());

  if (cursorCommand) {
    cursorCommand.execute();
  }
}

bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("cursor-changed", redraw);

function tick() {
  redraw();
  requestAnimationFrame(tick);
}

tick();

class LineCommand {
  points: [{ x: number; y: number }];

  constructor(newX: number, newY: number) {
    this.points = [{ x: newX, y: newY }];
  }

  execute() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    //ctx.strokeWidth = 4;
    ctx.beginPath();
    const { x, y } = this.points[zero];
    ctx.moveTo(x, y);
    for (const { x, y } of this.points) {
      const k = 2;
      ctx.lineTo(x + Math.random() * k, y + Math.random() * k);
    }
    ctx.stroke();
  }
  grow(x: number, y: number) {
    this.points.push({ x, y });
  }
}

let currentLineCommand: LineCommand | null = null;

canvas.addEventListener("mouseout", (e) => {
  cursorCommand = null;
  notify("cursor-changed");
});

canvas.addEventListener("mouseenter", (e) => {
  cursorCommand = new LineCommand(e.offsetX, e.offsetY);
  notify("cursor-changed");
});

canvas.addEventListener("mousemove", (e) => {
  cursorCommand = new LineCommand(e.offsetX, e.offsetY);
  notify("cursor-changed");

  if (e.buttons == 1) {
    currentLineCommand?.points.push({ x: e.offsetX, y: e.offsetY });
    notify("drawing-changed");
  }
});

canvas.addEventListener("mousedown", (e) => {
  currentLineCommand = new LineCommand(e.offsetX, e.offsetY);
  commands.push(currentLineCommand);
  redoCommands.splice(zero, redoCommands.length);
  notify("drawing-changed");
});

canvas.addEventListener("mouseup", (e) => {
  currentLineCommand = null;
  notify("drawing-changed");
});

app.append(document.createElement("br"));

const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
app.append(clearButton);

clearButton.addEventListener("click", () => {
  commands.splice(zero, commands.length);
  notify("drawing-changed");
});

const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
app.append(undoButton);

undoButton.addEventListener("click", () => {
  if (commands.length > zero) {
    const command = commands.pop()!;
    redoCommands.push(command);
    notify("drawing-changed");
  }
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
app.append(redoButton);

redoButton.addEventListener("click", () => {
  if (redoCommands.length > zero) {
    const command = redoCommands.pop()!;
    commands.push(command);
    notify("drawing-changed");
  }
});

/*
const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "D2";
const zero = 0;

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.id = "myCanvas";
app.append(canvas);

app.append(document.createElement("br"));

const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
app.append(clearButton);

const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
app.append(undoButton);

const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
app.append(redoButton);

const drawingEventChanged = new Event("drawing-changed");
const lines: { x: number; y: number }[][] = [];
let currentLine: { x: number; y: number }[] | null = [];
const redoLines: { x: number; y: number }[][] = [];

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const cursor: Cursor = new Cursor(false, zero, zero);

//const lines: Path2D[][] = [];
//const redoLines: Path2D[] = [];
//let currentLine: Path2D[] | null = null;

canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;

  //const coord = new Coordinate(cursor.x, cursor.y);

  currentLine = [];
  lines.push(currentLine);
  redoLines.splice(zero, redoLines.length);
  currentLine.push({ x: cursor.x, y: cursor.y });
  canvas.dispatchEvent(drawingEventChanged);
  //redraw();
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.active) {
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    const coord = new Coordinate(cursor.x, cursor.y);
    currentLine!.push(coord);
    canvas.dispatchEvent(drawingEventChanged);
    //redraw();
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  currentLine = null;
  canvas.dispatchEvent(drawingEventChanged);
  //redraw();
});

clearButton.addEventListener("click", () => {
  lines.splice(zero, lines.length);
  canvas.dispatchEvent(drawingEventChanged);
  //redraw();
});

undoButton.addEventListener("click", () => {
  if (lines.length > zero) {
    const line = lines.pop()!;
    redoLines.push(line);
    canvas.dispatchEvent(drawingEventChanged);
    //redraw();
  }
});

redoButton.addEventListener("click", () => {
  if (redoLines.length > zero) {
    const line = redoLines.pop()!;
    lines.push(line);
    canvas.dispatchEvent(drawingEventChanged);
    //redraw();
  }
});

canvas.addEventListener("drawing-changed", () => {
  redraw();
});

function redraw() {
  ctx.clearRect(zero, zero, canvas.width, canvas.height);
  for (const line of lines) {
    ctx.beginPath();
    const { x, y } = line[zero];
    ctx.moveTo(x, y);
    for (const { x, y } of line) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
*/
