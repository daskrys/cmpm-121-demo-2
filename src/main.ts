import "./style.css";
//import { Point } from "./draw";
import { CursorCommand } from "./draw";
import { LineCommand } from "./draw.ts";
import { Stickers } from "./draw.ts";
//import { MarkerLine } from "./draw.ts";
//import { Cursor } from "./draw.ts";
//import { Coordinate } from "./draw.ts";

("use strict");
const app: HTMLDivElement = document.querySelector("#app")!;
const gameName = "🎃";
const zero = 0;
const one = 1;
const scaleFactor = 4;
let waiting = false;
let thickness = 3;
let markerThickness = 15;
let currCursor = "*";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.id = "myCanvas";
app.append(canvas);

createLineBreak();

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const commands: LineCommand[] = [];
const redoCommands: LineCommand[] = [];
const stickers: Stickers[] = [];

let cursorCommand: CursorCommand | null = null;
const drawingChanged = new Event("drawing-changed");
const cursorChanged = new Event("cursor-changed");
const toolChanged = new Event("tool-changed");
const stickerChange = new Event("sticker-changed");

canvas.addEventListener("drawing-changed", () => {
  redraw();
});

canvas.addEventListener("cursor-changed", () => {
  redraw();
});

canvas.addEventListener("sticker-changed", () => {
  waiting = true;
});

canvas.addEventListener("tool-changed", () => {
  if (thickness <= zero) {
    thickness = one;
  }

  markerThickness = thickness * scaleFactor; // updates thickness of indicator
});

function redraw() {
  ctx.clearRect(zero, zero, canvas.width, canvas.height);
  exec();
}

function exec() {
  commands.forEach((cmd) => cmd.execute(ctx));
  stickers.forEach((stick) =>
    stick.execute(ctx, stick.points.x, stick.points.y)
  );

  if (cursorCommand) {
    cursorCommand.changeCursor(currCursor);
    cursorCommand.updateThickness(markerThickness);
    cursorCommand.execute(ctx);
  }
}

let currentLineCommand: LineCommand | null = null;

canvas.addEventListener("mouseout", () => {
  cursorCommand = null;
  canvas.dispatchEvent(cursorChanged);
});

canvas.addEventListener("mouseenter", (e) => {
  cursorCommand = new CursorCommand(e.offsetX, e.offsetY);
  canvas.dispatchEvent(cursorChanged);
});

canvas.addEventListener("mousemove", (e) => {
  cursorCommand = new CursorCommand(e.offsetX, e.offsetY);
  canvas.dispatchEvent(cursorChanged);

  if (e.buttons == one) {
    currentLineCommand?.pointsArr.push({ x: e.offsetX, y: e.offsetY });
    canvas.dispatchEvent(drawingChanged);
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (waiting) {
    const newSticker = new Stickers(e.offsetX, e.offsetY, currCursor);
    stickers.push(newSticker);
    waiting = false;
    currCursor = "*";
  }

  currentLineCommand = new LineCommand(thickness);
  commands.push(currentLineCommand);
  redoCommands.splice(zero, redoCommands.length);
  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("mouseup", () => {
  currentLineCommand = null;
  canvas.dispatchEvent(drawingChanged);
});

createLineBreak();
// clear / undo / redo buttons
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
app.append(clearButton);

clearButton.addEventListener("click", () => {
  commands.splice(zero, commands.length);
  stickers.splice(zero, stickers.length);
  canvas.dispatchEvent(drawingChanged);
});

const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
app.append(undoButton);

undoButton.addEventListener("click", () => {
  if (commands.length > zero) {
    const command = commands.pop()!;
    redoCommands.push(command);
    canvas.dispatchEvent(drawingChanged);
  }
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
app.append(redoButton);

redoButton.addEventListener("click", () => {
  if (redoCommands.length > zero) {
    const command = redoCommands.pop()!;
    commands.push(command);
    canvas.dispatchEvent(drawingChanged);
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

thickerButton.addEventListener("click", () => {
  thickness++;
  canvas.dispatchEvent(toolChanged);
});

thinnerButton.addEventListener("click", () => {
  thickness--;
  canvas.dispatchEvent(toolChanged);
});

createLineBreak();
// stickers
const ghostButton = document.createElement("button");
ghostButton.style.fontSize = "1.5em";
ghostButton.innerHTML = "👻";
app.append(ghostButton);

const owlButton = document.createElement("button");
owlButton.innerHTML = "🦉";
owlButton.style.fontSize = "1.5em";
app.append(owlButton);

const magicBallButton = document.createElement("button");
magicBallButton.innerHTML = "🔮";
magicBallButton.style.fontSize = "1.5em";
app.append(magicBallButton);

ghostButton.addEventListener("click", () => {
  currCursor = "👻";
  canvas.dispatchEvent(stickerChange);
});

owlButton.addEventListener("click", () => {
  currCursor = "🦉";
  canvas.dispatchEvent(stickerChange);
});

magicBallButton.addEventListener("click", () => {
  currCursor = "🔮";
  canvas.dispatchEvent(stickerChange);
});
