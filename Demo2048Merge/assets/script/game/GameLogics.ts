import DialogsManager from "../dialogs/DialogsManager";
import GameBoard from "./GameBoard";
import GameCell from "./GameCell";
import GameScore from "./GameScore";
import LevelConfig from "./LevelConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(GameScore) score: GameScore = null;
    @property(GameBoard) board: GameBoard = null;
    @property(DialogsManager) dialogsManager: DialogsManager = null;
    @property(cc.Node) locker: cc.Node = null;
    @property(cc.AudioClip) bgm: cc.AudioClip = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.on("on-cell-end", this.onCellEnd.bind(this));
        cc.game.on("restart-game", this.restartGame.bind(this));
        cc.game.on("calculate-score", this.calculateScore.bind(this));
        cc.game.on("can-drop-cell", this.createNewActiveCell.bind(this));
        cc.game.on("on-congratulation", this.onCongratulation.bind(this));
		cc.audioEngine.playMusic(this.bgm, true);
    }

    lock(enable: boolean) {
        this.locker.active = enable;
    }

    start() {
        this.score.resetGame();
        this.board.resetBoard();
        this.board.initCellPool();
        this.board.initBoard();
        this.board.createActiveCell(this.getActiveCellValueByLevel());
    }
    restartGame() {
        this.score.resetGame();
        this.score.setScore(0);
        this.board.resetBoard();
        this.board.createActiveCell(this.getActiveCellValueByLevel());
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

    async onCellEnd(cell: GameCell) {
        if (await this.board.dropCell(cell)) {
            this.board.createActiveCell(this.getActiveCellValueByLevel());
            if (!this.board.canDropCellToBoard()) {
                this.onGameOver();
            }
        }

    }
    calculateScore(value: number) {
        this.score.calculateScore(value);
    }
    onGameOver() {
        this.dialogsManager.onGameOver(this.score.score);
    }
    createNewActiveCell() {
        this.board.removeCell(this.board.activeCell);
        this.board.createActiveCell(this.getActiveCellValueByLevel());
    }
    onCongratulation() {
        this.dialogsManager.onCongratulation();
    }
}
