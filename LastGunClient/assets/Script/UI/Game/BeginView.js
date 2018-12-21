// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GunInfo = require("../../../resources/confige/gunInfo")
cc.Class({
    extends: cc.Component,

    properties: {
        playBtn: {
            default: null,
            type: cc.Node,
        },
        playText: {
            default: null,
            type: cc.Label,
        },
        playShare: {
            default: null,
            type: cc.Node,
        },
        playCoin: {
            default: null,
            type: cc.Node,
        },
        shopView: {
            default: null,
            type: cc.PageView,
        },
        gunName: {
            default: null,
            type: cc.Label,
        },
        weightVal: {
            default: null,
            type: cc.Node,
        },
        fireVal: {
            default: null,
            type: cc.Node,
        },
        ammoVal: {
            default: null,
            type: cc.Label,
        },
        curGunId: {
            default: 0,
            type: cc.Integer,
        },
        rankMask:{
            default: null,
            type: cc.Node,
        },
    },

    onEnable() {
        window.gameApplication.rankView.height = 700;
        window.gameApplication.rankView.y = -930;
        window.gameApplication.gameView.moneyVal.string = parseInt(window.gameApplication.gameView.moneyVal.string) + window.gameApplication.gameView.curMoney;
        window.gameApplication.gameView.moneyVal.node.parent.active = true;
        this.shopView.setCurrentPageIndex(this.curGunId);
        window.gameApplication.gameView.musicBtn.node.active = true;
        window.gameApplication.gameView.LoadRank();
        window.gameApplication.soundManager.playSound("reLoad");
    },

    onDisable(){
        window.gameApplication.rankView.y = -930;
    },

    onLoad() {
        SDK().getItem("money", function (moneyVal) {
            window.gameApplication.gameView.moneyVal.string = moneyVal;
        }.bind(this));
    },

    start() {
        this.initGunInfo(0);
    },

    menuClick(event, type, page) {
        if ("Share" == type) {
            window.gameApplication.onShareBtnClick();
        } else if ("Play" == type) {
            SDK().getItem("gun" + this.curGunId, function (num) {
                if (false) {
                    this.startGame();
                } else {
                    if (num == 1) {
                        this.startGame();
                    } else {
                        if (this.playShare.active == true) {
                            window.gameApplication.onShareBtnClick(function (isCompleted) {
                                if (isCompleted) {
                                    var param = {};
                                    param["gun" + this.curGunId] = 1;
                                    SDK().setItem(param);
                                    this.playShare.active = false;
                                    this.playText.string = "PLAY"
                                    this.playText.node.x = 0;
                                    this.playText.node.active = true;
                                }
                            }.bind(this));
                        } else {
                            SDK().getItem("money", function (moneyVal) {
                                if (moneyVal > GunInfo[this.curGunId][4]) {
                                    moneyVal = moneyVal - GunInfo[this.curGunId][4];
                                    window.gameApplication.gameView.moneyVal.string = moneyVal;
                                    SDK().setItem({ money: moneyVal });
                                    var param = {};
                                    param["gun" + this.curGunId] = 1;
                                    SDK().setItem(param);
                                    this.playShare.active = false;
                                    this.playText.string = "PLAY"
                                    this.playText.node.x = 0;
                                    this.playText.node.active = true;
                                    this.playCoin.active  = false;
                                } else {
                                    window.gameApplication.showVideoView(function (isCompleted) {
                                        if (isCompleted) {
                                            SDK().getItem("money", function (moneyVal) {
                                                moneyVal = moneyVal + 500;
                                                window.gameApplication.gameView.moneyVal.string = moneyVal;
                                                SDK().setItem({ money: moneyVal });
                                            }.bind(this))
                                        }
                                    }.bind(this), 2);
                                }
                            }.bind(this))
                        }
                    }
                }

            }.bind(this))

        }
        else if ("Rank" == type) {
            if(Math.abs(window.gameApplication.rankView.y) < 10){
                window.gameApplication.rankView.runAction(cc.moveTo(0.5,cc.v2(0,-930)).easing(cc.easeBackIn()) );
                this.rankMask.active = false;
            }else if( Math.abs(window.gameApplication.rankView.y + 930) < 10){
                window.gameApplication.gameView.LoadRank();
                window.gameApplication.rankView.runAction(cc.moveTo(0.8,cc.v2(0,0)).easing(cc.easeBackInOut()));
                this.rankMask.active = true;
            }
            
        }
        else if ("Video" == type) {
            window.gameApplication.showVideoView(function (isCompleted) {
                if (isCompleted) {
                    SDK().getItem("money", function (moneyVal) {
                        window.gameApplication.flyRewardAnim(500,null,window.gameApplication.gameView.moneyVal);
                        moneyVal = moneyVal + 500;
                        //window.gameApplication.gameView.moneyVal.string = moneyVal;
                        SDK().setItem({ money: moneyVal });
                    }.bind(this))
                }
            }.bind(this), 1);
        }
        else if ("Gift" == type) {
            window.gameApplication.onGiftBtnClick(function (isCompleted) {
                if (isCompleted) {
                    SDK().getItem("money", function (moneyVal) {
                        window.gameApplication.flyRewardAnim(80,null,window.gameApplication.gameView.moneyVal);
                        moneyVal = moneyVal + 80;
                        //window.gameApplication.gameView.moneyVal.string = moneyVal;
                        SDK().setItem({ money: moneyVal });
                    }.bind(this))
                }
            }.bind(this))
        }
        if ("SelectGun" == page) {
            var id = this.shopView.getCurrentPageIndex();
            this.initGunInfo(id);
        }
        window.gameApplication.soundManager.playSound("btn_click");
    },

    startGame(){
        window.gameApplication.soundManager.playSound("reLoad");
        window.gameApplication.gameView.initGame(this.curGunId);
        window.gameApplication.gameView.node.active = true;
        this.node.active = false;
    },


    initGunInfo(id) {
        this.playShare.active = false;
        this.playCoin.active = false;
        this.playText.node.active = false;
        this.curGunId = id;
        this.gunName.string = GunInfo[id][0];
        this.weightVal.width = (GunInfo[id][1] * 0.2) * 85;
        this.fireVal.width = (GunInfo[id][2] * 0.1) * 103;
        this.ammoVal.string = GunInfo[id][3];
        SDK().getItem("gun" + this.curGunId, function (num) {
            if (num == 1) {
                this.playText.string = "PLAY"
                this.playText.node.x = 0;
                this.playText.node.active = true;
            } else {
                if (GunInfo[id][4] < 0) {
                    this.playShare.active = true;
                } else {
                    if (GunInfo[id][4] != 0) {
                        this.playCoin.active = true;
                        this.playText.string = GunInfo[id][4];
                        this.playText.node.x = -30;
                        this.playText.node.active = true;
                    } else {
                        this.playText.string = "PLAY"
                        this.playText.node.x = 0;
                        this.playText.node.active = true;
                    }
                }
            }
        }.bind(this))
    },



    // update (dt) {},
});
