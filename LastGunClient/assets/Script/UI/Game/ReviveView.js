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
        //reviveView
        score: {
            default: null,
            type: cc.Label,
        },
        countingTime: {
            default: null,
            type: cc.Label,
        },
        countingTimeVal: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        isCounting: {
            default: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    menuClick(event, type) {
        window.gameApplication.soundManager.playSound("btn_click");
        //复活
        if ("Revive" == type) {
            this.isCounting = false;
            window.gameApplication.showVideoView(function (isCompleted) {
                if (isCompleted) {
                    var num = window.gameApplication.gameView.gun.init(window.gameApplication.gameView.gun.gunId);
                    window.gameApplication.gameView.ammoText.string = num;
                    window.gameApplication.gameView.ammoVal.width = 200;
                    window.gameApplication.gameView.ammoVal.color = cc.color(67, 255, 0, 255);
                    window.gameApplication.gameView.node.active = true;
                    window.gameApplication.reviveView.node.active = false;
                    window.gameApplication.gameView.gun.isDead = false;
                } else {
                    this.isCounting = true;
                }
            }.bind(this),4);
        }
        //不复活
        else if ("NoRevive" == type) {
            window.gameApplication.reviveView.node.active = false;
            window.gameApplication.overView.highestScore.string = window.gameApplication.gameView.highest.string;
            window.gameApplication.overView.curScore.string = "Final Score: " + window.gameApplication.gameView.myScoreText.string;
            window.gameApplication.overView.getMoney.string = window.gameApplication.gameView.curMoney;
            window.gameApplication.overView.node.active = true;
            SDK().getItem("highest",function(highestVal){
                if(highestVal<window.gameApplication.gameView.myScore){
                    SDK().setItem({highest:window.gameApplication.gameView.myScore});
                }
            }.bind(this));
        }
    },

    update(dt) {
        //复活界面的倒计时处理
        if (this.isCounting) {
            this.countingTimeVal = this.countingTimeVal - dt;
            var temp = this.countingTimeVal < 10 ? "0" + Math.floor(this.countingTimeVal) : Math.floor(this.countingTimeVal);
            this.countingTime.string = temp;
            if (this.countingTimeVal <= 0) {
                this.menuClick(null, "NoRevive");
            }
        }
    },
});
