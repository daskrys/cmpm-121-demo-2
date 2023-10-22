import "./style.css";
import { Cursor } from "./draw.ts";
import { Coordinate } from "./draw.ts";

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
