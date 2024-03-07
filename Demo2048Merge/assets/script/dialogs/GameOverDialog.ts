const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label) score: cc.Label = null;

    setData(score: number) {
        this.score.string = score.toString();

    }

    onRestart() {
        this.node.removeFromParent();
        cc.game.emit("restart-game");
    }
}
