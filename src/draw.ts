export class Cursor {
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
