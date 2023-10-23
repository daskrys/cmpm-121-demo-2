import "./style.css";
//import { Point } from "./draw";
import { CursorCommand } from "./draw";
import { LineCommand } from "./draw.ts";
//import { MarkerLine } from "./draw.ts";
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

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const commands: LineCommand[] = [];
const redoCommands: LineCommand[] = [];

let cursorCommand: CursorCommand | null = null;

const bus = new EventTarget();

function notify(name: string) {
  bus.dispatchEvent(new Event(name));
}

function redraw() {
  ctx.clearRect(zero, zero, canvas.width, canvas.height);

  commands.forEach((cmd) => cmd.execute(ctx));

  if (cursorCommand) {
    cursorCommand.execute(ctx);
  }
}

bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("cursor-changed", redraw);
/*
function tick() {
  redraw();
  requestAnimationFrame(tick);
}
*/
//tick();

let currentLineCommand: LineCommand | null = null;

canvas.addEventListener("mouseout", () => {
  cursorCommand = null;
  notify("cursor-changed");
});

canvas.addEventListener("mouseenter", (e) => {
  cursorCommand = new CursorCommand(e.offsetX, e.offsetY);
  notify("cursor-changed");
});

canvas.addEventListener("mousemove", (e) => {
  cursorCommand = new CursorCommand(e.offsetX, e.offsetY);
  notify("cursor-changed");

  if (e.buttons == 1) {
    currentLineCommand?.pointsArr.push({ x: e.offsetX, y: e.offsetY });
    notify("drawing-changed");
  }
});

canvas.addEventListener("mousedown", (e) => {
  currentLineCommand = new LineCommand(e.offsetX, e.offsetY);
  commands.push(currentLineCommand);
  redoCommands.splice(zero, redoCommands.length);
  notify("drawing-changed");
});

canvas.addEventListener("mouseup", () => {
  currentLineCommand = null;
  notify("drawing-changed");
});

createLineBreak();
// clear / undo / redo buttons
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

function createLineBreak() {
  app.append(document.createElement("br"));
}

createLineBreak();

const thickerButton = document.createElement("button");
thickerButton.innerHTML = "Thicker";
app.append(thickerButton);

const thinnerButton = document.createElement("button");
thinnerButton.innerHTML = "Thinner";
app.append(thinnerButton);
