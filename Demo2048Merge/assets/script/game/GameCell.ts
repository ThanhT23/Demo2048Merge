const { ccclass, property } = cc._decorator;

export interface ICoord {
    row: number;
    col: number;
}
export enum CellStage {
    EMPTY = 0,
    ACTIVE = 1,
}

@ccclass("CellData")
class CellData {
    @property(cc.Integer) value = 0;
    @property(cc.SpriteFrame) cellFrame: cc.SpriteFrame = null;
}

@ccclass
export default class extends cc.Component {
    @property(cc.Sprite) sprite: cc.Sprite = null;
    @property([CellData]) cellData: CellData[] = [];

    _value: number;
    get value() { return this._value }
    set value(value: number) {
        this._value = value;
        this.sprite.spriteFrame = this.cellData.find(m => m.value === value).cellFrame;
        value > 0 ? this.cellStage = CellStage.ACTIVE : this.cellStage = CellStage.EMPTY;
        this.sprite.node.setPosition(0, 0);
    }
    coord: ICoord;
    _startPosition: cc.Vec2;
    cellStage: CellStage;

    enableTouch(active = true) {
        if (active) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel.bind(this));
            this._startPosition = this.node.getPosition();
        } else {
            this.node.off(cc.Node.EventType.TOUCH_START);
            this.node.off(cc.Node.EventType.TOUCH_MOVE);
            this.node.off(cc.Node.EventType.TOUCH_END);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL);
        }
    }
    reset() {
        this.enableTouch(false);
        this._startPosition = null;
        this.node.setPosition(0, 0);
    }

    onTouchStart(touch: cc.Touch, event: cc.Event) {
        // this.node.position = cc.v3(event.getLocation());
    }
    onTouchMove(touch: cc.Touch, event: cc.Event) {
        this.node.setPosition(this.node.getPosition().add(touch.getDelta()));
        cc.game.emit("on-cell-move", this);
    }
    onTouchEnd(touch: cc.Touch, event: cc.Event) {
        cc.game.emit("on-cell-end", this);
    }
    returnToStartPosition() {
        console.log("returnToStartPosition", this._startPosition.x, this._startPosition.y);
        this.node.runAction(cc.moveTo(0.2, this._startPosition).easing(cc.easeSineIn()));
    }
    onTouchCancel(touch: cc.Touch, event: cc.Event) {
        this.node.runAction(cc.moveTo(0.2, this._startPosition).easing(cc.easeSineIn()));
    }

    setData(value: number) {
        this.value = value;
    }
    setCoord(coord: ICoord) {
        this.coord = coord;
    }
}
