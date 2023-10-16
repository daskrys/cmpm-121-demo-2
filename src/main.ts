import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Demo 2";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

let canvas = document.querySelector<HTMLDivElement>("#canvas")!;
canvas.innerHTML = "<canvas id='myCanvas'></canvas>";
