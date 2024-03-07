const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.Node) backgorund: cc.Node = null;
    @property(cc.Prefab) gameoverDialog: cc.Prefab = null;
    @property(cc.Prefab) pauseDialog: cc.Prefab = null;
    @property(cc.Prefab) congratulationDialog: cc.Prefab = null;

    async onGameOver(score: number) {
        var gameoverDialog = cc.instantiate(this.gameoverDialog).getComponent("GameOverDialog");
        this.node.addChild(gameoverDialog.node);
        gameoverDialog.setData(score);
    }
    onGamePause() {
        this.node.addChild(cc.instantiate(this.pauseDialog));
    }
    onCongratulation() {
        var congratulationDialog = cc.instantiate(this.congratulationDialog).getComponent("CongratulationsDialog");
        this.node.addChild(congratulationDialog.node);
    }
}