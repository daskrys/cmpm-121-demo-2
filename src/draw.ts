export interface Point {
  x: number;
  y: number;
}

export class CursorCommand {
  x: number;
  y: number;
  thickness: number = 15;

  constructor(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  updateThickness(newThickness: number) {
    this.thickness = newThickness;
  }

  execute(ctx: CanvasRenderingContext2D) {
    const toString = this.thickness.toString();
    console.log(toString);
    ctx.font = `${toString}px serif`;
    ctx.fillText("*", this.x, this.y);
  }
}

export class LineCommand {
  pointsArr: Point[];
  markerWidth: number;

  constructor(newThickness: number) {
    if (newThickness <= 0) {
      this.markerWidth = 1;
    }

    this.pointsArr = [];
    this.markerWidth = newThickness;
  }

  execute(ctx: CanvasRenderingContext2D) {
    const zero = 0;
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.markerWidth;
    ctx.beginPath();
    const { x, y } = this.pointsArr[zero];
    ctx.moveTo(x, y);
    for (const { x, y } of this.pointsArr) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  drag(newX: number, newY: number) {
    const newPoint: Point = { x: newX, y: newY };
    this.pointsArr.push(newPoint);
  }
}
/*
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
*/
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
