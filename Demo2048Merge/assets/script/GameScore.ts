const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.Label) scoreLabel: cc.Label = null;

    score: number = 0;
    calculateScore(point: number) {
        this.score += point;
        this.setScore(this.score);
    }
    setScore(score: number) {
        this.scoreLabel.string = score.toString();
    }
    resetGame() {
        this.score = 0;
        this.setScore(0);
    }
}