import GameBoard from "./GameBoard";
import GameCell from "./GameCell";
import GameScore from "./GameScore";
import LevelConfig from "./LevelConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {

    @property(GameScore) score: GameScore = null;
    @property(GameBoard) board: GameBoard = null;
    @property(cc.Prefab) pauseDialog: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.on("on-cell-end", this.onCellEnd.bind(this));
    }

    level: number = 0;
    start() {
        this.score.resetGame();
        this.board.resetBoard();
        this.board.initCellPool();
        this.board.initBoard();
        this.board.createActiveCell(this.getActiveCellValueByLevel());
    }
    resetGame() {
        this.score.resetGame();
        this.score.setScore(0);
        this.board.resetBoard();
        this.level = 1
    }
    onGamePause() {
        cc.instantiate(this.pauseDialog).parent = this.node;
    }

    getActiveCellValueByLevel() {
        var valuesByLevel = LevelConfig.LEVEL[this.getGameLevel()].cellVaues;
        return valuesByLevel[Math.floor(Math.random() * valuesByLevel.length)];
    }
    getGameLevel() {
        var score = this.score.score;
        var levelConfig = LevelConfig.LEVEL;
        for (var level in levelConfig) {
            if (score < levelConfig[level].score) {
                return parseInt(level);
            }
        }
        return LevelConfig.MAXLEVEL;
    }

    onCellEnd(cell: GameCell) {
        if (this.board.dropCell(cell)) {
            this.board.createActiveCell(this.getActiveCellValueByLevel());
            this.score.calculateScore(cell.value);
        }

    }
    // update (dt) {}
}
