import * as PIXI from "pixi.js";

export class Shooter extends PIXI.Sprite {
    public speed: number = 1;

    public readonly maxSpeed: number;

    public readonly rotate: number;

    constructor(texture: PIXI.Texture, maxSpeed: number, rotate: number) {
        super(texture);
        this.maxSpeed = maxSpeed;
        this.rotate = rotate;
    }
    public speedUp = function (this: Shooter) {
        if (this.speed < 32) {
            this.speed = Math.min(this.speed + this.speed / 30, 32);
        }
    };

    public speedDown = function (this: Shooter) {
        if (this.speed > 1) {
            this.speed = Math.max(this.speed - this.speed / 30, 1);
        }
    };
}