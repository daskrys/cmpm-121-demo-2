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
const commands: (LineCommand | Stickers)[] = [];
const redoCommands: (LineCommand | Stickers)[] = [];

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
  redraw();
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

  if (cursorCommand) {
    cursorCommand.changeCursor(currCursor);
    cursorCommand.updateThickness(markerThickness);
    cursorCommand.execute(ctx);
  }
}

let currentLineCommand: LineCommand | Stickers | null = null;

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
    const newSticker = new Stickers(
      e.offsetX,
      e.offsetY,
      currCursor,
      markerThickness * scaleFactor
    );
    commands.push(newSticker);
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

const customEmojiButton = document.createElement("button");
customEmojiButton.innerHTML = "Custom Emoji";
app.append(customEmojiButton);

customEmojiButton.addEventListener("click", () => {
  addCustomEmoji();
});

thickerButton.addEventListener("click", () => {
  thickness++;
  canvas.dispatchEvent(toolChanged);
});

thinnerButton.addEventListener("click", () => {
  thickness--;
  canvas.dispatchEvent(toolChanged);
});

createLineBreak();
const emojis: string[] = ["👻", "🦉", "🔮"];
// stickers

function createEmojiButtons() {
  for (let i = zero; i < emojis.length; i++) {
    const emojiButton = document.createElement("button");
    emojiButton.innerHTML = emojis[i];
    emojiButton.style.fontSize = "1.5em";
    app.append(emojiButton);

    emojiButton.addEventListener("click", () => {
      currCursor = emojis[i];
      canvas.dispatchEvent(stickerChange);
    });
  }
}

function addCustomEmoji() {
  const newEmoji = prompt("Enter a new emoji");
  if (newEmoji != null) {
    emojis.push(newEmoji);
    const emojiButton = document.createElement("button");
    emojiButton.innerHTML = newEmoji;
    emojiButton.style.fontSize = "1.5em";
    app.append(emojiButton);
    currCursor = newEmoji;
    canvas.dispatchEvent(stickerChange);
  }
}

createEmojiButtons();

function exportCanvas() {
  const newCanvas: HTMLCanvasElement = document.createElement("canvas");
  newCanvas.id = "myCanvas";
  newCanvas.width = canvas.width * 2;
  newCanvas.height = canvas.height * 4;

  const newCtx = newCanvas.getContext("2d")!;
  newCtx.fillStyle = "white";
  newCtx.scale(2, 4);
  newCtx.fillRect(zero, zero, canvas.width, canvas.height);

  commands.forEach((cmd) => cmd.execute(newCtx));

  const save = document.createElement("a");
  save.href = newCanvas.toDataURL("image/png");
  save.download = "sketchpad.png";
  save.click();
}

const exportButton = document.createElement("button");
exportButton.innerHTML = "Export";
app.append(exportButton);

exportButton.addEventListener("click", () => {
  exportCanvas();
});
