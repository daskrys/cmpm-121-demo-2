const twelve = 12;
const zero = 0;

export interface Point {
  x: number;
  y: number;
}

export class CursorCommand {
  x: number;
  y: number;
  thickness: number = twelve;
  cursor = "*";

  constructor(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  changeCursor(newCursor: string) {
    this.cursor = newCursor;
  }

  updateThickness(newThickness: number) {
    this.thickness = newThickness;
  }

  execute(ctx: CanvasRenderingContext2D) {
    const toString = this.thickness.toString();
    ctx.font = `${toString}px serif`;
    ctx.fillText(this.cursor, this.x, this.y);
  }
}

export class LineCommand {
  pointsArr: Point[];
  markerWidth: number;

  constructor(newThickness: number) {
    if (newThickness <= zero) {
      this.markerWidth = 1;
    }

    this.pointsArr = [];
    this.markerWidth = newThickness;
  }

  execute(ctx: CanvasRenderingContext2D) {
    if (this.pointsArr.length == zero) {
      return;
    }

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

export class Stickers {
  emoji: string;
  stickerArr: Point[];
  markerWidth: number;

  constructor(
    newX: number,
    newY: number,
    newEmoji: string,
    newThickness: number
  ) {
    if (newThickness <= zero) {
      this.markerWidth = 1;
    }

    this.emoji = newEmoji;
    this.stickerArr = [];
    this.stickerArr.push({ x: newX, y: newY });
    this.markerWidth = newThickness;
  }

  execute(ctx: CanvasRenderingContext2D) {
    if (this.stickerArr.length == zero) {
      return;
    }

    ctx.fillText(
      this.emoji,
      this.stickerArr[zero].x,
      this.stickerArr[zero].y,
      this.markerWidth
    );
  }

  drag(newX: number, newY: number) {
    this.stickerArr.push({ x: newX, y: newY });
  }
}
