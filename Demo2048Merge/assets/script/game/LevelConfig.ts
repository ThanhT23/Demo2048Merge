const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelConfig {
    static MAXLEVEL = 10;
    static LEVEL = {
        0: {
            score: 10,
            cellVaues: [2]
        },
        1: {
            score: 20,
            cellVaues: [2, 4]
        },
        2: {
            score: 50,
            cellVaues: [2, 4, 8]
        },
        3: {
            score: 200,
            cellVaues: [2, 4, 8, 16]
        },
        4: {
            score: 500,
            cellVaues: [2, 4, 8, 16, 32]
        },
        5: {
            score: 1000,
            cellVaues: [2, 4, 8, 16, 32, 64]
        },
        6: {
            score: 1200,
            cellVaues: [2, 4, 8, 16, 32, 64, 128]
        },
        7: {
            score: 2000,
            cellVaues: [2, 4, 8, 16, 32, 64, 128, 256]
        },
        8: {
            score: 3000,
            cellVaues: [2, 4, 8, 16, 32, 64, 128, 256, 512]
        },
        9: {
            score: 5000,
            cellVaues: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]
        },
        10: {
            score: 10000,
            cellVaues: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]
        }
    }
}