import * as PIXI from "pixi.js";


export default class Rader extends PIXI.Container {

    // レーダーの大枠情報
    private readonly mainScrInfo = { w: 200, h: 150 };

    // レーダーの子枠情報
    private readonly miniScrInfo = { w: 50, h: 38 };

    private miniScrCenter = {
        x: this.mainScrInfo.w / 2 - this.miniScrInfo.w / 2,
        y: this.mainScrInfo.h / 2 - this.miniScrInfo.h / 2,
    }

    private readonly dots: PIXI.Graphics = new PIXI.Graphics();

    constructor() {
        super();

        const graphics: PIXI.Graphics = new PIXI.Graphics();
        graphics.alpha = 0.5;

        // レーダー大枠描画
        graphics.beginFill(0xffffff);
        graphics.drawRect(0, 0, this.mainScrInfo.w, this.mainScrInfo.h); // 800 600の1/4
        graphics.endFill();

        //  中央ににレーダー枠小描画
        graphics.lineStyle(2, 0x000000);

        graphics.drawRect(this.miniScrCenter.x, this.miniScrCenter.y, this.miniScrInfo.w, this.miniScrInfo.h); // 200,150の1/4
        graphics.endFill();

        super.addChild(graphics);
        super.addChild(this.dots);
    }

    /**
     * 引数で指定されたポジションをレーダーにドットで反映させます。
     * @param position 反映対象のオブジェクトの実際の位置
     * @param color ドットの色
     */
    public dot(position: PIXI.ObservablePoint<any>, color: number): void {
        this.dots.beginFill(color);
        const radarPos = {
            x: this.miniScrCenter.x + position.x / 16,
            y: this.miniScrCenter.y + position.y / 16,
        }
            ;

        this.dots.drawCircle(
            Math.min(Math.max(radarPos.x, 0), this.mainScrInfo.w),
            Math.min(Math.max(radarPos.y, 0), this.mainScrInfo.h),
            1
        );
    }

    public clear(): void {
        this.dots.clear();
    }
}