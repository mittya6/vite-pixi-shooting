type EVENT = "key" | "code";

export default class Key {

    private isDown: boolean = false;

    private eventProperty: string = 'code';

    private isDownedOnce: boolean | undefined = undefined;

    private keycode: string;

    constructor(keycode: string, eventProperty: EVENT) {
        this.keycode = keycode;
        this.subcribe();
        if (eventProperty) {
            this.eventProperty = eventProperty;
        }
    }

    //The `downHandler`
    private downHandler(event: any) {
        //console.log(event[this.eventProperty] );
        //console.log(event.key );
        if (event[this.eventProperty] == this.keycode) {
            this.isDown = true;
            if (this.isDownedOnce === undefined) {
                this.isDownedOnce = true;
            }
            event.preventDefault();
        }
    }

    //The `upHandler`
    private upHandler(event: any) {
        if (event[this.eventProperty] == this.keycode) {
            this.isDown = false;
            this.isDownedOnce = undefined;
            event.preventDefault();
        }
    }

    // Detach event listeners
    public unsubscribe(): void {
        window.removeEventListener("keydown", this.downHandler.bind(this));
        window.removeEventListener("keyup", this.upHandler.bind(this));
    }

    public subcribe(): void {
        window.addEventListener("keydown", this.downHandler.bind(this), false);
        window.addEventListener("keyup", this.upHandler.bind(this), false);
    }

    public isUnderDown() {
        return this.isDown;
    }

    public isDowned() {
        if (this.isDownedOnce) {
            this.isDownedOnce = false;
            return true;
        }
        return false;
    }
}