export interface Point {
  x: number;
  y: number;
}

export class MarkerLine {
  pointArr: Point[];
  markerThickness: string;
  constructor(thickness: string) {
    this.pointArr = [];
    this.markerThickness = thickness;
  }

  drag(x: number, y: number) {
    this.pointArr.push({ x: x, y: y });
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

/*export class Cursor {
  active: boolean;
  x: number;
  y: number;

  constructor(newActive: boolean, newX: number, newY: number) {
    this.active = newActive;
    this.x = newX;
    this.y = newY;
  }
}

export class Coordinate {
  x: number;
  y: number;

  constructor(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }
}
*/
