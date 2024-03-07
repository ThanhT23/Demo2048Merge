
const { ccclass, property } = cc._decorator;

@ccclass
export default class extends cc.Component {
    @property(cc.Node) backgorund: cc.Node = null;

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

    createRenderTexture() {
        var gl = cc.game["_renderContext"];
        var size = this.node.getContentSize();
        var r = new cc.RenderTexture();
        r.initWithSize(size.width, size.height, gl.STENCIL_INDEX8);
        return r;
    }
    getRenderTextureFromCamera() {
        var renderTexture = this.createRenderTexture();
        var camera = this.node.addComponent(cc.Camera);
        camera.targetTexture = renderTexture;
        camera.zoomRatio = cc.winSize.height / renderTexture.height;
        camera.render();
        camera.targetTexture = null;
        return renderTexture;
    }
    prepareImage(texture: cc.RenderTexture) {
        var data = texture.readPixels();
        var width = texture.width;
        var height = texture.height;

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        var rowBytes = width * 4;
        for (var row = 0; row < height; row++) {
            var srow = height - 1 - row;
            var imageData = ctx.createImageData(width, 1);
            var start = srow * width * 4;
            for (var i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }
        return canvas.toDataURL("image/jpeg", 0.8);
    }
    async shareUserProgess() {
        this.node.opacity = 0;
        let image = this.prepareImage(this.getRenderTextureFromCamera());
        this.node.opacity = 255;

        return await FBInstant.shareAsync({
            intent: 'SHARE',
            image: image,
            text: "PLAY_WITH_ME",
            data: {
                fromUser: {
                    id: FBInstant.player.getID(),
                    photo: FBInstant.player.getPhoto(),
                    name: FBInstant.player.getName(),
                }
            }
        }).then(() => {
            this.closeDialog();
        });
    }
}
