
const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {

    @property(cc.Node) backgorund: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable() {
        // resize canvas to match device resolution
        var frameSize = cc.view.getFrameSize();
        var canvasSize = this.node.getContentSize();
        canvasSize.width = frameSize.width * canvasSize.height / frameSize.height;
        this.backgorund.setContentSize(canvasSize);
        this.backgorund.on(cc.Node.EventType.TOUCH_END, this.closeDialog, this);
    }
    start() {

    }
    closeDialog() {
        this.node.removeFromParent(true);
    }
    getRenderTextureFromCamera() {

    }

    // update (dt) {}
}
