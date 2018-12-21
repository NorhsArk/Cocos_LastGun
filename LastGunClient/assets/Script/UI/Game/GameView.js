import { isContext } from "vm";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
/* var colors = [cc.color(255, 138, 138, 255), cc.color(255, 240, 138, 255), cc.color(183, 255, 138, 255), cc.color(138, 228, 255, 255), cc.color(192, 138, 255, 255)];
var lColors = [cc.color(204, 71, 71, 255), cc.color(236, 214, 66, 255), cc.color(115, 216, 52, 255), cc.color(70, 183, 218, 255), cc.color(133, 63, 214, 255)];
 */
var Gun = require("../Game/Gun");
var PropView = require("../Game/PropView");
cc.Class({
    extends: cc.Component,

    properties: {
        clickView: {
            default: null,
            type: cc.Node,
        },
        propView: {
            default: [],
            type: [PropView],
        },
        myScore: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        myScoreText: {
            default: null,
            type: cc.Label,
        },
        gun: {
            default: null,
            type: Gun,
        },
        musicBtn: {
            default: null,
            type: cc.Sprite,
        },
        moneyVal: {
            default: null,
            type: cc.Label,
        },
        ammoVal: {
            default: null,
            type: cc.Node,
        },
        ammoText: {
            default: null,
            type: cc.Label,
        },
        highest: {
            default: null,
            type: cc.Label,
        },
        isRevive: {
            default: false,
            visible: false,
        },
        pauseLater: {
            default: null,
            type: cc.Node,
        },
        pauseView: {
            default: null,
            type: cc.Node,
        },
        curMoney: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        //榜单界面
        worldBtn: {
            default: null,
            type: cc.Node,
        },
        friendBtn: {
            default: null,
            type: cc.Node,
        },
        worldList: {
            default: null,
            type: cc.Node,
        },
        friendList: {
            default: null,
            type: cc.Node,
        },
        worldContent: {
            default: null,
            type: cc.Node,
        },
        friendContent: {
            default: null,
            type: cc.Node,
        },
        //头像储存
        headSpriteList: {
            default: {},
            visible: false,
        },
        //储存用户信息列表
        worldPlayer: {
            default: [],
            visible: false,
        },
        friendPlayer: {
            default: [],
            visible: false,
        },
        //储存用户UI列表
        worldUIPlayer: {
            default: [],
            visible: false,
        },
        friendUIPlayer: {
            default: [],
            visible: false,
        },
        prefab_player: {
            default: null,
            type: cc.Prefab,
        },
        viewAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },



    onLoad() {
        this.resetPropPos();
        SDK().getItem("highest", function (highestVal) {
            this.highest.string = "Best Score: " + highestVal;
        }.bind(this));
    },

    guideAnim() {
        this.guideHand.setLocalZOrder(1);
        this.guideHand.active = true;
        this.guideHand.position = this.helpList[0].node.position;
        this.scheduleOnce(function () {
            this.guideHand.active = false;
        }.bind(this), 8.5)
        for (var i = 1; i < 5; i = i + 1) {
            if (i == 4) {
                i = 0;
                this.guideHand.runAction(cc.sequence(cc.delayTime(6), cc.moveTo(2, this.helpList[i].node.position).easing(cc.easeIn(2))));
                i = 5;
            } else {
                this.guideHand.runAction(cc.sequence(cc.delayTime(2 * (i - 1)), cc.moveTo(2, this.helpList[i].node.position).easing(cc.easeIn(2))));
            }
        }
    },

    start() {
        //console.log(window.bid,window.mid,window.lid,window.gameApplication);
        //this.clickView.off('down', this._onVsPoleDown, this);

        //触摸事件处理
        this.clickView.on('moveClick', this.onScreenClick, this);

        //背景下落监听
        this.gun.node.on('propDown', this.propDown, this);

        //死亡监听
        this.gun.node.on('dead', this.gameOver, this);

        //分数监听
        this.gun.node.on('updataScore', this.updataScore, this);

        //碰撞事件处理
        this.gun.node.on('getMoney', this.onGetMoney, this);

    },


    //开始游戏
    initGame(id) {
        this.resetPropPos();
        SDK().getItem("highest", function (highestVal) {
            this.highest.string = "Best Score: " + highestVal;
        }.bind(this));
        this.curMoney = 0;
        this.gun.isDead = false;
        this.gun.isShoot = false;
        this.isRevive = false;
        this.musicBtn.node.active = false;//隐藏音乐开关
        this.myScore = 0;
        this.myScoreText.string = 0;
        this.ammoText.string = this.gun.ammoNum;//子弹数量
        this.gun.resetGun();
        var num = this.gun.init(id);
        this.ammoText.string = num;
        this.ammoVal.width = 200;
        this.ammoVal.color = cc.color(67, 255, 0, 255);
    },

    //点击事件
    onScreenClick(event) {
        var data = event.detail;
        var isTouching = data.isTouching;
        this.gun.isShoot = isTouching;
    },

    //更新分数
    updataScore(event) {
        var data = event.detail;
        this.myScore = data.score;
        this.myScoreText.string = this.myScore;
    },

    onGetMoney(event) {
        var data = event.detail;
        var other = data.other;
        this.curMoney = this.curMoney + 1;
        this.moneyVal.string = parseInt(this.moneyVal.string) + 1;
        SDK().setItem({ money: parseInt(this.moneyVal.string) });
    },

    //游戏结束
    gameOver() {
        if (!this.isRevive) {
            this.isRevive = true;
            this.node.active = false;
            window.gameApplication.reviveView.countingTimeVal = 11;
            window.gameApplication.reviveView.isCounting = true;
            window.gameApplication.reviveView.score.string = "SCORE: " + this.myScoreText.string;
            window.gameApplication.reviveView.node.active = true;
        } else {
            this.node.active = false;
            window.gameApplication.overView.highestScore.string = window.gameApplication.gameView.highest.string;
            window.gameApplication.overView.curScore.string = "Final Score: " + this.myScoreText.string;
            window.gameApplication.overView.getMoney.string = this.curMoney;
            window.gameApplication.overView.node.active = true;
            SDK().getItem("highest", function (highestVal) {
                if (highestVal < this.myScore) {
                    SDK().setItem({ highest: this.myScore });
                }
            }.bind(this));
        }
    },

    //背景界面下降
    propDown(event) {
        var data = event.detail;
        var moveVal = data.moveVal;
        this.propView[0].move(-moveVal);
        this.propView[1].move(-moveVal);
    },

    //重置背景位置
    resetPropPos() {
        this.propView[0].curIdx = 0;
        this.propView[1].curIdx = 1;
        this.propView[0].node.width = cc.winSize.width;
        this.propView[0].node.height = cc.winSize.height;
        this.propView[1].node.width = cc.winSize.width;
        this.propView[1].node.height = cc.winSize.height;
        this.propView[0].node.y = 0;
        this.propView[1].node.y = cc.winSize.height;
        this.propView[0].drowProp();
        this.propView[1].drowProp();
    },

    //处理点击点的碰撞
    onClickCollision(evt) {
        var data = evt.detail;
    },

    menuClick(event, type) {
        window.gameApplication.soundManager.playSound("btn_click");
        //静音按钮
        if ("Music" == type) {
            if (window.gameApplication.soundManager.isOpen) {
                window.gameApplication.soundManager.setIsOpen(false);
                this.musicBtn.spriteFrame = this.viewAtlas.getSpriteFrame("musicOff");
            } else {
                window.gameApplication.soundManager.setIsOpen(true);
                this.musicBtn.spriteFrame = this.viewAtlas.getSpriteFrame("musicOn");
            }
        }
        //暂停
        else if ("Pause" == type) {
            if(!this.gun.isDead){
                this.gun.isDead = true;
                this.pauseView.active = true;
                this.pauseLater.active = true;
            }
        }
        //回到主页
        else if ("Home" == type) {
            this.gun.isDead = false;
            this.pauseLater.active = false;
            this.pauseView.active = false;
            this.node.active = false;
            window.gameApplication.beginView.node.active = true;
        }
        //继续游戏
        else if ("Continue" == type) {
            this.pauseView.active = false;
            this.scheduleOnce(function () {
                this.gun.isDead = false;
                this.pauseLater.active = false;
            }.bind(this), 1.5)
        }
        //榜单界面
        else if ("WorldRank" == type) {
            this.GetWorldRank(this.worldPlayer);
            this.worldList.active = true;
            this.worldBtn.active = true;
            this.friendList.active = false;
            this.friendBtn.active = false;
        } else if ("FriendRank" == type) {
            SDK().shareBestScore3Times("all");
            this.GetFriendRank(this.friendPlayer);
            this.worldList.active = false;
            this.worldBtn.active = false;
            this.friendList.active = true;
            this.friendBtn.active = true;
        }
    },

    //加载榜单
    LoadRank() {
        SDK().getFriendsInfo(function (list) {
            this.GetFriendRank(list);
        }.bind(this));
        SDK().getRank(2, 20, 0, function (list) {
            this.GetWorldRank(list);
        }.bind(this));
        this.menuClick(null,"WorldRank")
    },

    //好友邀请列表
    GetFriendRank(list) {
        this.friendPlayer = list;
        for (var i = 0; i < this.friendPlayer.length; i = i + 1) {
            var playerBar;
            var Head;
            var Name;
            if (i >= this.friendUIPlayer.length) {
                playerBar = cc.instantiate(this.prefab_player);
                this.friendUIPlayer[i] = {};
                this.friendUIPlayer[i].playerBar = playerBar;

                Head = playerBar.getChildByName("Head").getComponent(cc.Sprite);
                this.friendUIPlayer[i].Head = Head;

                Name = playerBar.getChildByName("Name").getComponent(cc.Label);
                this.friendUIPlayer[i].Name = Name;

                var No = playerBar.getChildByName("No");
                this.friendUIPlayer[i].No = No;
                var Score = playerBar.getChildByName("Score");
                this.friendUIPlayer[i].Score = Score;
            } else {
                playerBar = this.friendUIPlayer[i].playerBar;
                Head = this.friendUIPlayer[i].Head;
                Name = this.friendUIPlayer[i].Name;
            }
            this.friendUIPlayer[i].No.active = false;
            this.friendUIPlayer[i].Score.active = false;
            var playBtn = playerBar.getChildByName("Play");
            Name.string = this.friendPlayer[i].name;
            playerBar.name = this.friendPlayer[i].id;
            var self = this;
            let id = this.friendPlayer[i].id
            playBtn.off(cc.Node.EventType.TOUCH_END);
            playBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                SDK().playWith(id, self.highestScore, function (isCompleted) {

                }.bind(this));

            }, this);
            //Name.string = "<b><color=#696969>" + this.friendPlayer[i].name + "</color></b>";
            playerBar.parent = this.friendContent;
            //加载头像
            this.LoadSprite(this.friendPlayer[i].headUrl, Head, this.headSpriteList[this.friendPlayer[i].id]);
        }
        if (this.friendPlayer.length < this.friendUIPlayer.length) {
            for (var i = this.friendPlayer.length; i < this.friendUIPlayer.length; i = i + 1) {
                this.friendUIPlayer[i].playerBar.active = false;
            }
        }
    },

    //世界排行榜
    GetWorldRank(list) {
        this.worldPlayer = list;
        var isOnRank = false;
        for (var i = 0; i < this.worldPlayer.length; i = i + 1) {
            if (this.LoadRankData(i, this.worldPlayer[i])) {
                isOnRank = true;
            }
        }
        //如果自己不在榜单上就将自己加载最后
        var listLength = this.worldPlayer.length;
        if (!isOnRank) {
            listLength = listLength + 1;
            SDK().getRankScore(2, function (info) {
                this.LoadRankData(listLength - 1, info);
            }.bind(this))
        }
        //隐藏多余的榜单
        if (listLength < this.worldUIPlayer.length) {
            for (var i = this.worldPlayer.length; i < this.worldUIPlayer.length; i = i + 1) {
                this.worldUIPlayer[i].playerBar.active = false;
            }
        }
    },

    //将玩家信息加载到第I排
    LoadRankData(i, playerData) {
        var isOnRank = false;
        var playerBar;
        var mainBg;
        var No;
        var Score;
        var Head;
        var Name;
        if (i >= this.worldUIPlayer.length) {
            playerBar = cc.instantiate(this.prefab_player);
            mainBg = playerBar.getComponent(cc.Sprite);
            No = playerBar.getChildByName("No").getComponent(cc.Label);
            Score = playerBar.getChildByName("Score").getComponent(cc.Label);
            Head = playerBar.getChildByName("Head").getComponent(cc.Sprite);
            Name = playerBar.getChildByName("Name");
            this.worldUIPlayer[i] = {};
            this.worldUIPlayer[i].playerBar = playerBar;
            this.worldUIPlayer[i].mainBg = mainBg;
            this.worldUIPlayer[i].No = No;
            this.worldUIPlayer[i].Score = Score;
            this.worldUIPlayer[i].Head = Head;
            this.worldUIPlayer[i].Name = Name;
            this.worldUIPlayer[i].Name.active = false;
        } else {
            playerBar = this.worldUIPlayer[i].playerBar;
            mainBg = this.worldUIPlayer[i].mainBg;
            No = this.worldUIPlayer[i].No;
            Score = this.worldUIPlayer[i].Score;
            Head = this.worldUIPlayer[i].Head;
        }
        No.node.active = true;
        Score.node.active = true;
        playerBar.name = playerData.id;
        playerBar.parent = this.worldContent;
        //是否为自己
        if (playerData.id == SDK().getSelfInfo().id) {
            //mainBg.spriteFrame = this.rankAtlas.getSpriteFrame("bg1");
            isOnRank = true;
        } else {
            //this.worldUIPlayer[i].mainBg = playerBar.getComponent(cc.Sprite);
            //this.worldUIPlayer[i].mainBg.spriteFrame = this.rankAtlas.getSpriteFrame("barBg");
        };
        //隐藏play按钮
        var playBtn = playerBar.getChildByName("Play");
        playBtn.active = false;
        //加载名次
        No.string = playerData.no;
        //加载分数
        Score.string = playerData.score;
        //加载头像
        this.LoadSprite(playerData.headUrl, Head, this.headSpriteList[playerData.id]);
        return isOnRank;
    },

    //根据URL加载头像并到对应的sprite上
    LoadSprite(url, sprite, saver,size) {
        if (saver == null) {
            cc.loader.load(url, function (err, texture) {
                saver = new cc.SpriteFrame(texture);
                sprite.spriteFrame = saver;
                if(size!=null){
                    sprite.node.width = size.x;
                    sprite.node.height = size.y;
                }
            });
        } else {
            sprite.spriteFrame = saver;
            if(size!=null){
                sprite.node.width = size.x;
                sprite.node.height = size.y;
            }
        }
        
    },

    update(dt) { },
});
