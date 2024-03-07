
const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {

    @property(cc.Node) backgorund: cc.Node = null;
    @property(cc.Toggle) musicToggle: cc.Toggle = null;
    @property(cc.Node) unCheckToggle: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable() {
        // resize canvas to match device resolution
        var frameSize = cc.view.getFrameSize();
        var canvasSize = this.node.getContentSize();
        canvasSize.width = frameSize.width * canvasSize.height / frameSize.height;
        this.backgorund.setContentSize(canvasSize);
        this.backgorund.on(cc.Node.EventType.TOUCH_END, this.closeDialog, this);
        this.musicToggle.isChecked = cc.audioEngine.getMusicVolume() > 0;
        this.unCheckToggle.active = !this.musicToggle.isChecked;
    }
    start() {

    }
    continueGame() {
        this.closeDialog();
    }
    restartGame() {
        this.closeDialog();
        cc.game.emit("restart-game");
    }


    closeDialog() {
        this.node.removeFromParent(true);
    }
    toggleMusic() {
        cc.audioEngine.setMusicVolume(this.musicToggle.isChecked ? 1 : 0);
        this.unCheckToggle.active = !this.musicToggle.isChecked;
    }

    // update (dt) {}
}
