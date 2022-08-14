import * as PIXI from "pixi.js";

export function rotateMove(target: PIXI.Sprite, [x, y]: number[], rotate: number) {
    //角度を変更
    target.rotation += rotate;
    //敵と主人公の距離を計算
    const distance = Math.sqrt(
        Math.pow(target.x - x, 2) +
        Math.pow(target.y - y, 2)
    );
    //敵と主人公の角度(radian)を計算
    var enemyRadian = Math.atan2(
        target.y - y,
        target.x - x
    );
    const radian = enemyRadian + rotate;
    target.x = Math.cos(radian) * distance + x;
    target.y = Math.sin(radian) * distance + y;
}