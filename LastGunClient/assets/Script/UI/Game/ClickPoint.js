// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.node.parent.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.onMouseDown(event);
        }, this);

        /* this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.onMouseMove(event);
        }, this); */

        this.node.parent.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onMouseUp(event);
        }, this);

        this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.onMouseUp(event);
        }, this);
    },

    /**
        * 当屏幕点击
        */
    onMouseDown(event) {
        this.isTouching = true;
        this.node.emit('moveClick',{isTouching:true});
    },

    /* onMouseMove(event) {
        if (this.isTouching) {
            this.touchPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
            this.node.position = this.touchPos;
            this.node.emit('moveClick',{pos:this.touchPos});
        }
    }, */

    onMouseUp(event) {
        this.isTouching = false;
        this.node.emit('moveClick',{isTouching:false});
    },


    start() {

    },

    // update (dt) {},
});
