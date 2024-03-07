import GameCell, { CellStage } from "./GameCell";

const ROW = 4;
const COL = 4;
const DEFAULT_BOARD =
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.Prefab) cell: cc.Prefab = null;
    @property(cc.Node) boardContainer: cc.Node = null;
    @property(cc.Node) activeCellContainer: cc.Node = null;

    cellPool: cc.NodePool;
    boardCells: GameCell[] = [];
    activeCell: GameCell;
    targetCell: GameCell;

    onLoad() {
        cc.game.on("on-cell-move", this.onCellMove.bind(this));
    }

    // init
    initBoard() {
        for (var row = 0; row < ROW; row++) {
            for (var col = 0; col < COL; col++) {
                var cell = this.initCell(DEFAULT_BOARD[col][row]);
                cell.node.parent = this.boardContainer;
                cell.enableTouch(false);
                cell.setCoord({ row, col });
                this.boardCells.push(cell);
            }
        }
    }
    resetBoard() {
        if (this.boardCells.length > 0) {
            this.boardCells.forEach(cell => cell.value = 0);
            this.cellPool.put(this.activeCell.node);
        } else {
            this.boardContainer.removeAllChildren();
            this.activeCellContainer.removeAllChildren();
        }
    }
    flat(array: any[]) {
        var r: any[] = [];
        for (var m of array) {
            if (m instanceof Array) {
                r.push(...this.flat(m));
            } else {
                r.push(m);
            }
        }
        return r;
    }

    // control cell
    initCellPool() {
        this.cellPool = new cc.NodePool("Cell");
        for (var i = 0; i < ROW * COL + 1; i++) {
            var cell = cc.instantiate(this.cell);
            this.cellPool.put(cell);
        }
    }
    initCell(value: number) {
        var r = this.cellPool.get();
        if (!r) {
            r = cc.instantiate(this.cell);
        }
        var cell = r.getComponent(GameCell);
        cell.reset();
        cell.value = value;
        return cell;
    }
    removeCell(cell: GameCell) {
        this.cellPool.put(cell.node);
    }
    //
    createActiveCell(activeCellValue: number) {
        var cell = this.initCell(activeCellValue);
        cell.node.parent = this.activeCellContainer;
        this.activeCell = cell;
        cell.node.setPosition(0, 0);
        cell.enableTouch(true);
    }

    // move control
    onCellMove(cell: GameCell) {
        let cellWorldPos = cell.node.convertToWorldSpaceAR(cc.v2(0, 0));
        this.targetCell = this._getCellByLocation(cellWorldPos);
        this.canDropCell() && (this.targetCell.node.opacity = 100);
        this.boardCells.forEach(m => {
            if (m !== this.targetCell) {
                m.node.opacity = 255;
            }
        })
    }

    async dropCell(cell: GameCell) {
        if (this.canDropCell()) {
            this.targetCell.node.opacity = 255;
            this.targetCell.value = cell.value;
            this.removeCell(cell);
            await this.checkMergeCell(this.targetCell);
            if(this.targetCell.value == 2048) {
                cc.game.emit("on-congratulation");
            }
            this.targetCell = null;
            return Promise.resolve(true);
        } else {
            cell.returnToStartPosition();
            return Promise.resolve(false);
        }
    }
    canDropCell() {
        if (this.targetCell && this.targetCell.cellStage == CellStage.EMPTY) {
            return true;
        }
        return false;
    }
    getCellNeighbours(cell: GameCell) {
        var coord = cell.coord;
        var neighbours: GameCell[] = [];
        if (coord.col > 0) {
            neighbours.push(this.getCell(coord.col - 1, coord.row));
        }
        if (coord.col < COL - 1) {
            neighbours.push(this.getCell(coord.col + 1, coord.row));
        }
        if (coord.row > 0) {
            neighbours.push(this.getCell(coord.col, coord.row - 1));
        }
        if (coord.row < ROW - 1) {
            neighbours.push(this.getCell(coord.col, coord.row + 1));
        }
        return neighbours;
    }
    async checkMergeCell(cell: GameCell) {
        var neighbours = this.getCellNeighbours(cell);
        var canMerge = false;
        let actionTime = 0.1;
        for (const neighbour of neighbours) {
            if (neighbour.value == cell.value) {
                canMerge = true;
                let actionEndPos = neighbour.sprite.node.convertToNodeSpaceAR(cell.node.convertToWorldSpaceAR(cc.v2(0, 0)));
                neighbour.sprite.node.runAction(cc.sequence(
                    cc.moveTo(0.2, actionEndPos),
                    cc.callFunc(() => {
                        cc.game.emit("calculate-score", neighbour.value);
                        neighbour.value = 0
                    })));
            }
        }
        if (canMerge) {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    cell.value *= 2;
                    this.checkMergeCell(cell);
                }, actionTime * 2 * 1000);
                this.node.on("end-check-merge", () => { resolve() });
            })
        } else {
            this.node.emit("end-check-merge")
            // return Promise.resolve();
        }
    }
    canDropCellToBoard() {
        return this.boardCells.some(m => m.cellStage == CellStage.EMPTY);
    }

    _getCellByLocation(location: cc.Vec2) {
        for (var col = 0; col < COL; col++) {
            for (var row = 0; row < ROW; row++) {
                let cell = this.getCell(col, row);
                if (cell && cell.node.getBoundingBoxToWorld().contains(location)) {
                    return cell
                }
            }
        }
        return null;
    }
    getCell(col: number, row: number) {
        return this.boardCells.find(m => m.coord.col == col && m.coord.row == row);
    }
}
