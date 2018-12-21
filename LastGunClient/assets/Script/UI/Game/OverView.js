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
        //overView
        curScore: {
            default: null,
            type: cc.Label,
        },
        highestScore: {
            default: null,
            type: cc.Label,
        },
        getMoney: {
            default: null,
            type: cc.Label,
        },
        doubleBtn: {
            default: null,
            type: cc.Button,
        },
        adSprite: {
            default: null,
            type: cc.Sprite,
        },
        adSaver: {
            default: null,
            type: cc.SpriteFrame,
            visible: false,
        },
    },


    // onLoad () {},

    onEnable() {
        SDK().getRecommendGames(1, function (isOK, res) {
            if (null != res.data.rows[0].pic5 && "" != res.data.rows[0].pic5) {
                window.gameApplication.gameView.LoadSprite(res.data.rows[0].pic5, this.adSprite, this.adSaver, cc.v2(this.adSprite.node.width, this.adSprite.node.height));
                this.adSprite.node.off(cc.Node.EventType.TOUCH_END);
                this.adSprite.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                    SDK().switchGameAsync(res.data.rows[0].game_id);
                }, this);
            }
        }.bind(this))
        window.gameApplication.rankView.height = 350;
        window.gameApplication.rankView.y = -750;
        window.gameApplication.gameView.moneyVal.node.parent.active = false;
        this.doubleBtn.interactable = true;
        SDK().setRankScore(2, window.gameApplication.gameView.myScore, "{}", null);
        window.gameApplication.gameView.LoadRank();
        window.gameApplication.rankView.runAction(cc.moveTo(0.8, cc.v2(0, -350)).easing(cc.easeBackInOut()));
        window.gameApplication.shake(this.doubleBtn.node, true);
        window.gameApplication.playTimes++;
    },

    onDisable() {
        window.gameApplication.rankView.y = -750;
        window.gameApplication.shake(this.doubleBtn.node, false);
    },

    start() {

    },

    menuClick(event, type) {
        window.gameApplication.soundManager.playSound("btn_click");
        //回到选择关卡按钮
        if ("Share" == type) {
            window.gameApplication.onShareBtnClick();
        }
        //看视频双倍
        else if ("Double" == type) {
            window.gameApplication.showVideoView(function (isCompleted) {
                if (isCompleted) {
                    this.doubleBtn.interactable = false;
                    this.doubleBtn.node.stopAllActions();
                    this.doubleBtn.node.rotation = 0;
                    SDK().getItem("money", function (money) {
                        if (window.gameApplication.gameView.curMoney > 0) {
                            window.gameApplication.flyRewardAnim(window.gameApplication.gameView.curMoney, null, null);
                            money = money + window.gameApplication.gameView.curMoney;
                            SDK().setItem({ money: money });
                        }
                    }.bind(this))
                }
            }.bind(this), 3);
        }
        //重玩
        else if ("Home" == type) {
            window.gameApplication.gameView.node.active = false;
            window.gameApplication.overView.node.active = false;
            window.gameApplication.beginView.node.active = true;
        }
    },

    update(dt) {
    },
});
