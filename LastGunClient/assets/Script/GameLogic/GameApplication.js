import { isNull } from "util";

var SoundManager = require("../GameLogic/SoundManager");
var ViewManager = require("../GameLogic/ViewManager");
var GameView = require("../UI/Game/GameView");
var BeginView = require("../UI/Game/BeginView");
var OverView = require("../UI/Game/OverView");
var ReviveView = require("../UI/Game/ReviveView");

cc.Class({
    extends: cc.Component,

    properties: {
        viewManager: {
            default: null,
            type: ViewManager,
        },
        soundManager: {
            default: null,
            type: SoundManager,
        },
        gameView: {
            default: null,
            type: GameView,
        },
        beginView: {
            default: null,
            type: BeginView,
        },
        reviveView: {
            default: null,
            type: ReviveView,
        },
        overView: {
            default: null,
            type: OverView,
        },
        rewardObject: {
            default: null,
            type: cc.Prefab,
        },
        rankView: {
            default: null,
            type: cc.Node,
        },
        fbView_prefab: {
            default: null,
            type: cc.Prefab,
        },
        VideoView_prefab: {
            default: null,
            type: cc.Prefab,
        },
        curLang: {
            get: function () {
                return window.i18n.curLang;
            }
        },
        _playTimes: {
            default: 0,
            type: cc.Integer,
        },
        playTimes: {
            get: function () {
                return this._playTimes;
            },
            set: function (val) {
                this._playTimes = val;
                //播放插屏广告条件判断
                if ((this._playTimes > 1 && this._playTimes % SDK().getInterstitialCount() == 0 && this._playTimes >= SDK().getInterstitialCount()) || (SDK().getInterstitialCount() <= 1 && this._playTimes > 1)) {
                    console.log("播放插屏广告");
                    var delayTime = 0.2 + Math.random();
                    this.scheduleOnce(function () {
                        SDK().showInterstitialAd(function (isCompleted) {
                            console.log("播放Done");
                        }, false);
                    }, delayTime);

                    SDK().canCreateShortcutAsync();
                }
                if (this._playTimes == 3) {
                    this.onShareBtnClick(null);
                }
            },
        },
    },

    onLoad() {
        window.gameApplication = this;
        const i18n = require('LanguageData');
        i18n.init('zh');
        SDK().init();
        SDK().setItem({ gun0: 1 });
        this.beginView.node.active = true;
    },

    start() {
    },


    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
    },

    setNodeActive(nodePath, active) {
        cc.find("Canvas/" + nodePath).active = active;
    },

    //显示是否观看视频的提示框
    showVideoView(cb, TextType) {
        if (this.VideoView == null) {
            var view = cc.instantiate(this.VideoView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.VideoView = view;
        }
        let Titel = this.VideoView.getChildByName("Bg").getChildByName("Titel")
        let reward = Titel.getChildByName("Reward");
        Titel = Titel.getComponent("LocalizedLabel");
        reward.active = false;
        if (TextType == 1) {
            Titel.dataID = "label_text.getRewardText";
            reward.active = true;
        } else if (TextType == 2) {
            Titel.dataID = "label_text.lackMoneyText";
            reward.active = true;
        } else if (TextType == 3) {
            Titel.dataID = "label_text.doubleText";
        } else if (TextType == 4) {
            Titel.dataID = "label_text.reviveText";
        }
        let sureBtn = this.VideoView.getChildByName("Bg").getChildByName("Sure");
        sureBtn.off(cc.Node.EventType.TOUCH_END);
        sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onVideoBtnClick(cb,this.VideoView);
        }, this);

        var laterBtn = this.VideoView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.VideoView.active = false;
            cb(false);
        }, this);
        this.VideoView.active = true;
    },

    onVideoBtnClick(cb,node) {
        console.log("看视频");
        SDK().showVideoAd(
            function (isCompleted) {
                if (isCompleted) {
                    node.active = false;
                    cb(true);
                } else {
                    console.log("没有观看成功");
                    this.fbFail(1);
                }
            }.bind(this)
        );
    },

    onGiftBtnClick(cb) {
        SDK().showInterstitialAd(
            function (isCompleted) {
                if (null == isCompleted) {
                    console.log("没有观看成功")
                    this.fbFail(1);
                } else if (isCompleted) {
                    cb(true);
                } else {
                    console.log("没有观看成功")
                    this.fbFail(1);
                }
            }.bind(this)
            , true);
    },

    onShareBtnClick(cb) {
        SDK().getItem("highest", function (highestVal) {
            SDK().share(highestVal, function (isCompleted) {
                if (isCompleted) {//分享激励
                    console.log("ShareSuccess");
                    if (cb != null) {
                        cb(true);
                    }
                } else {
                    this.fbFail(2);
                }
            }.bind(this));
        }.bind(this));
    },

    fbFail(type) {
        var view = cc.instantiate(this.fbView_prefab);
        var Canvas = cc.find("Canvas");
        view.parent = Canvas;
        view.width = window.width;
        view.height = window.height;
        var btn = view.getChildByName("Okay");
        btn.on(cc.Node.EventType.TOUCH_END);
        btn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.fbView.active = false;
            btn.parent.destroy();
        }, this);
        this.fbView = view;
        if (type == 1) {
            this.fbView.getChildByName("Bg").getChildByName("VideoText").active = true;
            this.fbView.getChildByName("Bg").getChildByName("ShareText").active = false;
        } else {
            this.fbView.getChildByName("Bg").getChildByName("VideoText").active = false;
            this.fbView.getChildByName("Bg").getChildByName("ShareText").active = true;
        }
        this.fbView.active = true;

    },

    shake(node, isShake) {
        if (isShake) {
            var b = node.getComponent(cc.Button);
            if (b != null) {
                if (b.interactable) {
                    node.runAction(cc.repeatForever(cc.sequence(
                        cc.rotateTo(0.1, 5).easing(cc.easeIn(2)),
                        cc.rotateTo(0.2, -5).easing(cc.easeIn(2)),
                        cc.rotateTo(0.2, 5).easing(cc.easeIn(2)),
                        cc.rotateTo(0.1, 0).easing(cc.easeIn(2)),
                        cc.delayTime(0.5)
                    )));
                }
            } else {
                node.runAction(cc.repeatForever(cc.sequence(
                    cc.rotateTo(0.1, 5).easing(cc.easeIn(2)),
                    cc.rotateTo(0.2, -5).easing(cc.easeIn(2)),
                    cc.rotateTo(0.2, 5).easing(cc.easeIn(2)),
                    cc.rotateTo(0.1, 0).easing(cc.easeIn(2)),
                    cc.delayTime(0.5)
                )));
            }
        } else {
            node.stopAllActions();
        }
    },

    flyRewardAnim(num, bPos, label) {
        let getVal = num;
        if (num > 10) {
            num = 10;
        }
        this.schedule(function () {
            let reward = cc.instantiate(this.rewardObject);
            //reward.color = cc.color(255, 121, 121, 255);
            //reward.getComponent(cc.Sprite).spriteFrame = this.viewAtlas.getSpriteFrame("tipShape");
            reward.parent = cc.find("Canvas/UIView");
            if (bPos == null) {
                reward.position = cc.v2(0, 0);
            } else {
                reward.position = bPos;
            }
            if (label == null) {
                reward.runAction(
                    cc.sequence(
                        cc.moveBy(0.8, cc.v2(0, 400)).easing(cc.easeIn(2)),
                        cc.callFunc(function () {
                            reward.destroy();
                        }),
                    )
                );
            } else {
                var ePos = label.node.parent.convertToNodeSpaceAR(label.node.position);
                ePos = reward.parent.convertToNodeSpaceAR(cc.v2(-ePos.x, -ePos.y));
                reward.runAction(cc.sequence(
                    cc.moveTo(0.8, ePos).easing(cc.easeIn(2)),
                    cc.callFunc(function () {
                        reward.destroy();
                    }.bind(this)),
                ));
            }
        }.bind(this), 0.05, num, 0);
        if(label !=null){
            this.scheduleOnce(function () {
                label.node.runAction(
                    cc.sequence(
                        cc.scaleTo(0.2, 1.2),
                        cc.callFunc(function () {
                            label.string = parseInt(label.string) + getVal;
                        }.bind(this)),
                        cc.scaleTo(0.2, 1),
                    )
                )
            }.bind(this), 0.8 + (num * 0.05));
        }
    },

    shakeSreen(node){
        node.runAction(cc.sequence(
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(cc.randomMinus1To1()*10,cc.randomMinus1To1()*10)),
            cc.moveTo(0.02,cc.v2(0,0)),
        ));
    },

    // update (dt) {},
});
