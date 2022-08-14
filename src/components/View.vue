<script setup lang="ts">
import Key from "./Key";
import Radar from "./Radar";
import { Shooter } from "./Shooter";
import * as PIXI from "pixi.js";
import { getHitArea, intersects } from "./Intersect";
import { onMounted, Ref, ref } from "vue";
import imgFighter from "../assets/game/fighter.png";
import imgEnemy from "../assets/game/enemy.png";
import imgBackground from "../assets/game/background.png";
import imgBeam from "../assets/game/beam.png";
import { rotateMove } from "./Move";

const el: Ref = ref(null);
// mounted
onMounted(() => {
  // キャンバスサイズと背景色を指定してステージを作成
  const app: PIXI.Application = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xcccccc, // 背景色(= #cccccc)
  });
  el.value.appendChild(app.view);

  const loader: PIXI.Loader = PIXI.Loader.shared;
  loader.add("fighter", imgFighter);
  loader.add("enemy", imgEnemy);
  loader.add("background", imgBackground);
  loader.add("beam", imgBeam);
  loader.load(setup);

  const keyUp: Key = new Key("ArrowUp", "code");
  const keyDown: Key = new Key("ArrowDown", "code");
  const keyLeft: Key = new Key("ArrowLeft", "code");
  const keyRight: Key = new Key("ArrowRight", "code");
  const keySpace: Key = new Key("Space", "code");

  function setup(
    loader: PIXI.Loader,
    resources: PIXI.utils.Dict<PIXI.LoaderResource>
  ): void {
    const tilingSprite: PIXI.TilingSprite = new PIXI.TilingSprite(
      resources.background.texture!!,
      resources.background.texture!!.width * 2,
      resources.background.texture!!.height * 2
    );
    tilingSprite.anchor.set(0.5, 0.5);
    tilingSprite.position.set(app.screen.width * 0.5, app.screen.height * 0.5);
    app.stage.addChild(tilingSprite);

    const radar: Radar = new Radar();
    radar.position.set(550, 400);
    app.stage.addChild(radar);

    const fighter = new Shooter(resources.fighter.texture!!, 32, 0.01);
    fighter.position.set(380, 400);
    app.stage.addChild(fighter);

    let enemies: Shooter[] = [];
    [0, 1, 2, 3, 4].forEach((target) => {
      const curEnemy = new Shooter(resources.enemy.texture!!, 16, 0.01);
      curEnemy.position.set(70 * target, 80 * target);
      curEnemy.anchor.set(0.5, 0.5);
      //
      curEnemy.hitArea = new PIXI.Polygon([
        new PIXI.Point(0, 0),
        new PIXI.Point(curEnemy.width, 0),
        new PIXI.Point(curEnemy.width, curEnemy.height),
        new PIXI.Point(0, curEnemy.height),
      ]);

      app.stage.addChild(curEnemy);
      enemies.push(curEnemy);
    });
    fighter.hitArea = new PIXI.Polygon([
      new PIXI.Point(0, 0),
      new PIXI.Point(fighter.width, 0),
      new PIXI.Point(fighter.width, fighter.height),
      new PIXI.Point(0, fighter.height),
    ]);

    let beams: PIXI.Sprite[] = [];
    //const test = new PIXI.Graphics();
    //app.stage.addChild(test);
    app.ticker.add((delta) => {
      if (keyUp.isUnderDown()) {
        fighter.speedUp();
      }
      if (keyDown.isUnderDown()) {
        fighter.speedDown();
      }
      if (keyRight.isUnderDown()) {
        tilingSprite.rotation -= fighter.rotate;

        // 戦闘機の左右の動きに併せて敵機を動かす処理
        [...beams, ...enemies].forEach((curEnemy) => {
          // 敵を円周上に移動
          rotateMove(curEnemy, [fighter.x, fighter.y], -fighter.rotate);
        });
      }
      if (keyLeft.isUnderDown()) {
        tilingSprite.rotation += fighter.rotate;

        // 戦闘機の左右の動きに併せて敵機を動かす処理
        [...beams, ...enemies].forEach((curEnemy) => {
          // 敵を円周上に移動
          rotateMove(curEnemy, [fighter.x, fighter.y], fighter.rotate);
        });
      }
      // Mapを移動
      const angle = tilingSprite.angle - 90;
      const radian = (angle * Math.PI) / 180;
      tilingSprite.tilePosition.x += Math.cos(radian) * fighter.speed;
      tilingSprite.tilePosition.y -= Math.sin(radian) * fighter.speed;

      enemies.forEach((curEnemy) => {
        let radian2 = ((curEnemy.angle - 90) * Math.PI) / 180;
        curEnemy.position.x += Math.cos(radian2) * curEnemy.speed;
        curEnemy.position.y +=
          Math.sin(radian2) * curEnemy.speed + fighter.speed;
      });

      // 敵機と玉の衝突判定
      beams = beams.filter((target) => {
        let radian2 = ((target.angle - 90) * Math.PI) / 180;
        target.position.x += Math.cos(radian2) * 20;
        target.position.y += Math.sin(radian2) * 20 + fighter.speed;
        if (target.position.y < 0) {
          app.stage.removeChild(target);
          return false;
        }
        return true;
      });

      if (keySpace.isDowned()) {
        const beam = new PIXI.Sprite(resources.beam.texture);
        beam.position.set(380, 400);
        app.stage.addChild(beam);
        beam.hitArea = new PIXI.Polygon([
          new PIXI.Point(0, 0),
          new PIXI.Point(beam.width, 0),
          new PIXI.Point(beam.width, beam.height),
          new PIXI.Point(0, beam.height),
        ]);
        beams.push(beam);
      }

      radar.clear();
      radar.dot(fighter.position, 0x000000);
      [...enemies].forEach((target) => {
        radar.dot(target.position, 0x990000);
      });

      // test.clear();
      // test.lineStyle(1, 0x999900, 1);
      // [fighter, ...enemies, ...beams].forEach((target) => {
      //   test.drawPolygon(getHitArea(target));
      // });

      beams = beams.filter((curBeam) => {
        let intersect = false;
        enemies = enemies.filter((curEnemy) => {
          if (intersects(curBeam, curEnemy)) {
            console.log("intersets");
            curEnemy.destroy();
            intersect = true;
            return false;
          }
          return true;
        });
        if(intersect){
          curBeam.destroy();
        }
        return !intersect;
      });
    });
  }
});
</script>

<template>
  <div ref="el"></div>
</template>

<style scoped>
</style>