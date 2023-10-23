let markerWidth = 3;

export function getMarkerWidth() {
  return markerWidth;
}
export function setMarkerWidth(newWidth: number) {
  markerWidth = newWidth;
}

export interface Point {
  x: number;
  y: number;
}

export class CursorCommand {
  x: number;
  y: number;

  constructor(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  execute(ctx: CanvasRenderingContext2D) {
    ctx.font = "15px Helvetica";
    ctx.fillText("*", this.x, this.y);
  }
}

export class LineCommand {
  pointsArr: Point[];

  constructor(newX: number, newY: number) {
    const newPoint = { x: newX, y: newY };
    this.pointsArr = [newPoint];
  }

  execute(ctx: CanvasRenderingContext2D) {
    const zero = 0;
    ctx.strokeStyle = "black";
    ctx.lineWidth = markerWidth;
    //ctx.strokeWidth = 4;
    ctx.beginPath();
    const { x, y } = this.pointsArr[zero];
    ctx.moveTo(x, y);
    for (const { x, y } of this.pointsArr) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  drag(x: number, y: number) {
    const newPoint = { x, y };
    this.pointsArr.push(newPoint);
  }
}

export class MarkerLine {
  pointArr: Point[];
  markerThickness: string;
  constructor(thickness: string) {
    this.pointArr = [];
    this.markerThickness = thickness;
  }

  drag(x: number, y: number) {
    const newPoint = { x, y };
    this.pointArr.push(newPoint);
  }

  display(ctx: CanvasRenderingContext2D) {
    if (this.pointArr.length == 0) {
      return;
    }

    ctx.lineWidth = parseInt(this.markerThickness);
    const first: Point = this.pointArr[0];

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (const i of this.pointArr) {
      ctx.lineTo(i.x, i.y);
    }

    ctx.stroke();
  }
}
