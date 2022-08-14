//https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function

import * as PIXI from 'pixi.js';


// Check the direction these three points rotate
function RotationDirection(p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number): number {
    if (((p3y - p1y) * (p2x - p1x)) > ((p2y - p1y) * (p3x - p1x)))
        return 1;
    else if (((p3y - p1y) * (p2x - p1x)) == ((p2y - p1y) * (p3x - p1x)))
        return 0;

    return -1;
}

function containsSegment(x1: number, y1: number, x2: number, y2: number, sx: number, sy: number): boolean {
    if (x1 < x2 && x1 < sx && sx < x2) return true;
    else if (x2 < x1 && x2 < sx && sx < x1) return true;
    else if (y1 < y2 && y1 < sy && sy < y2) return true;
    else if (y2 < y1 && y2 < sy && sy < y1) return true;
    else if (x1 == sx && y1 == sy || x2 == sx && y2 == sy) return true;
    return false;
}

export function hasIntersection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
    var f1 = RotationDirection(x1, y1, x2, y2, x4, y4);
    var f2 = RotationDirection(x1, y1, x2, y2, x3, y3);
    var f3 = RotationDirection(x1, y1, x3, y3, x4, y4);
    var f4 = RotationDirection(x2, y2, x3, y3, x4, y4);

    // If the faces rotate opposite directions, they intersect.
    var intersect = f1 != f2 && f3 != f4;

    // If the segments are on the same line, we have to check for overlap.
    if (f1 == 0 && f2 == 0 && f3 == 0 && f4 == 0) {
        intersect = containsSegment(x1, y1, x2, y2, x3, y3) || containsSegment(x1, y1, x2, y2, x4, y4) ||
            containsSegment(x3, y3, x4, y4, x1, y1) || containsSegment(x3, y3, x4, y4, x2, y2);
    }

    return intersect;
}

/*
 X  @ Point X to be rotated
 Y  @ Point Y to be rotated  
 CX @ Origin X  
 CY @ Origin Y
 anticlock_wise @ to rotate point in clockwise direction or anticlockwise , default clockwise 
 return @ {x,y}  
*/
function rotate(x: number, y: number, cx: number, cy: number, radians: number) {
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

export function getHitArea(sprite: PIXI.Sprite): number[] {
    const hitarea: PIXI.Polygon = <PIXI.Polygon>sprite.hitArea;
    const nPoints: number[] = [];
    for (let i: number = 0; i < hitarea.points.length; i++) {
        if (i % 2 > 0) {
            continue;
        }
        const px: number = hitarea.points[i] + sprite.x - sprite.width * sprite.anchor.x;
        const py: number = hitarea.points[i + 1] + sprite.y - sprite.height * sprite.anchor.y;
        nPoints.push(...rotate(px, py, sprite.x, sprite.y, -sprite.rotation))
    }

    return nPoints;
}

export function intersects(sprite1: PIXI.Sprite,sprite2: PIXI.Sprite):boolean{
    const points1:number[] = getHitArea(sprite1)
    const points2:number[] = getHitArea(sprite2)

    for(let i1:number = 0; i1<points1.length; i1++){
        if(i1%2 > 0){
            continue;
        }
        for(let i2:number = 0; i2<points1.length; i2++){
            if(i2%2 > 0){
                continue;
            }
            const x1 = points1[i1];
            const y1 = points1[i1+1];
            const x2 = points1[(i1+2)%points1.length];
            const y2 = points1[(i1+3)%points1.length];
            const x3 = points2[i2];
            const y3 = points2[i2+1];
            const x4 = points2[(i2+2)%points2.length];
            const y4 = points2[(i2+3)%points2.length];
            if(hasIntersection(x1,y1,x2,y2,x3,y3,x4,y4)){
                return true;
            }
        }
    }
    return false;
}