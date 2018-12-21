// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Gun = require("../UI/Game/Gun");
cc.Class({
    extends: cc.Component,

    properties: {
        gun: {
            default: null,
            type: Gun,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onCollisionEnter: function (other, self) {
        this.gun.onCollisionEnter(other, self);
    },

    onCollisionStay: function (other, self) {
    },

    onCollisionExit: function (other, self) {
        this.gun.onCollisionExit(other, self);
    },

    start () {

    },

    // update (dt) {},
});
