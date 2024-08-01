import gsap from "gsap";
import { App } from "../system/App";

export class Tile {
  constructor(color) {
    this.color = color;
    this.sprite = App.sprite(color);
    this.sprite.anchor.set(0.5);
    this.sprite.interactive = true;
  }

  setPosition(position) {
    this.sprite.x = position.x;
    this.sprite.y = position.y;
  }

  moveTo(position, duration, delay, easing) {
    return new Promise((resolve) => {
      gsap.to(this.sprite, {
        pixi: {
          x: position.x,
          y: position.y,
        },
        duration,
        onComplete: () => resolve(),
        delay,
        ease: easing
      });
    });
  }

  isNeighbor(tile) {
    const rowDis = Math.abs(this.field.row - tile.field.row)
    const colDis = Math.abs(this.field.col - tile.field.col)

    return rowDis + colDis == 1
  }

  remove() {
    if (!this.sprite) return

    this.sprite.destroy();
    this.sprite = null;

    if (this.field) {
      this.field.tile = null
      this.field = null
    }
  }

  fallDownTo(position, delay) {
    return this.moveTo(position, 0.5, delay, "bounce.out")
  }
}