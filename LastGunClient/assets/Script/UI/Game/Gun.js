var GunInfo = require("../../../resources/confige/gunInfo")
var SpriteAnimation = require("../SpriteAnimation");
var angleToRadian = 2 * Math.PI / 360;
cc.Class({
    extends: cc.Component,

    properties: {
        good: {
            default: null,
            type: cc.Node,
        },
        gun: {
            default: [],
            type: [cc.Node],
        },
        gunSprite: {
            default: [],
            type: [cc.Sprite],
        },
        gunBox: {
            default: [],
            type: [cc.BoxCollider],
        },
        firePoint: {
            default: [],
            type: [SpriteAnimation],
        },
        bulletIdx: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        bullets: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        gunId: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        xSpeed: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        ySpeed: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        force: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        roSpeed: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        roForce: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        fireVal: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        weightVal: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        fireInterval: {
            default: 0,
            type: cc.Float,
            visible: false,
        },
        curHigh: {
            default: 0,
            tpye: cc.Float,
            visible: false,
        },
        ammoNum: {
            default: 0,
            tpye: cc.Integer,
            visible: false,
        },
        isDead: {
            default: false,
            visible: false,
        },
        gunAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        isShoot: {
            default: false,
            visible: false,
        },
    },

    onCollisionEnter: function (other, self) {
        if (other.tag == 1) {
            var spriteAnim = other.node.getComponent(SpriteAnimation);
            spriteAnim.playSprites("coin_", 6, 6, 1, 15, false,1 );
            other.enabled = false;
            this.node.emit('getMoney', { other: other });
            window.gameApplication.soundManager.playSound("money")
        } else if (other.tag == 2) {
            var spriteAnim = other.node.getComponent(SpriteAnimation);
            spriteAnim.playSprites("bullet_", 5, 1, 1, 15, false,1.5);
            other.enabled = false;
            this.ammoNum = this.ammoNum + GunInfo[this.gunId][3] * 0.5;
            if (this.ammoNum > GunInfo[this.gunId][3]) {
                this.ammoNum = GunInfo[this.gunId][3];
            }
            var levelPer = (this.ammoNum / GunInfo[this.gunId][3]);
            window.gameApplication.gameView.ammoVal.width = levelPer * 200;
            window.gameApplication.gameView.ammoText.string = this.ammoNum;
            window.gameApplication.gameView.ammoVal.color = cc.color(67, 255, 0, 255);
            window.gameApplication.gameView.ammoVal.parent.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1)));

        } else if (other.tag == 3) {
            window.gameApplication.soundManager.playSound("speedUp")
            var spriteAnim = other.node.getComponent(SpriteAnimation);
            spriteAnim.playSprites("speed_", 7, 3, 1, 15, false,1);
            other.enabled = false;
            var yVal = 2000 * Math.cos(other.node.rotation * angleToRadian);//Y轴偏移量
            var xVal = 2000 * Math.sin(other.node.rotation * angleToRadian);//X轴偏移量 
            this.xSpeed = this.xSpeed + xVal
            if (yVal <= this.ySpeed) {
                this.ySpeed + 200;
            } else {
                this.ySpeed = yVal;
            }

            /* if (other.node.rotation > 0) {
                this.xSpeed = this.xSpeed + 200;
            } else if (other.node.rotation < 0) {
                this.xSpeed = this.xSpeed - 200;
            } */
            /* this.gun[0].stopAllActions();
            this.gun[1].stopAllActions();
            this.gun[0].runAction(cc.moveBy(0.5,cc.v2(xVal,yVal)));
            this.gun[1].runAction(cc.moveBy(0.5,cc.v2(xVal,yVal))); */

        } else if (other.tag == 4) {
            this.xSpeed = 0;
            this.ySpeed = 0;
        }

    },

    onCollisionStay: function (other, self) {
        if (other.tag == 4) {
            this.xSpeed = 0;
            if (this.ySpeed > 0) {
                this.ySpeed = 0;
            }
        }
    },

    onCollisionExit: function (other, self) {
    },



    start() {
        this.bulletIdx = 0;
    },

    resetGun() {
        this.gun[0].scale = 0.9;
        this.gun[1].scale = 0.9;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.force = 0;
        this.roForce = 0;
        this.fireInterval = 0;
        this.height = 20;
    },

    init(id) {
        this.gunId = id;
        this.gunSprite[0].spriteFrame = this.gunAtlas.getSpriteFrame("gun" + id + "_0");
        this.gunSprite[1].spriteFrame = this.gunSprite[0].spriteFrame;

        //设置炮火位置
        this.firePoint[0].node.position = GunInfo[id][7];
        this.firePoint[1].node.position = GunInfo[id][7];

        //设置碰撞体的大小和位置
        this.gunBox[0].size.width = this.gunSprite[0].node.width;
        this.gunBox[0].size.height = this.gunSprite[0].node.height;
        this.gunBox[1].size.width = this.gunSprite[1].node.width;
        this.gunBox[1].size.height = this.gunSprite[1].node.height;
        this.gunBox[0].tag = 0;
        this.gunBox[1].tag = 0;
        //设置枪的重心
        this.gunSprite[0].node.anchorX = GunInfo[id][6].x;
        this.gunSprite[0].node.anchorY = GunInfo[id][6].y;
        this.gunSprite[1].node.anchorX = this.gunSprite[0].node.anchorX;
        this.gunSprite[1].node.anchorY = this.gunSprite[0].node.anchorY;

        this.fixX = -(this.gunSprite[0].node.anchorX - 0.5) * this.gunSprite[0].node.width;
        this.fixY = -(this.gunSprite[0].node.anchorY - 0.5) * this.gunSprite[0].node.height;
        this.gunBox[0].offset = cc.v2(this.fixX, this.fixY);
        this.gunBox[1].offset = cc.v2(this.fixX, this.fixY)
        this.firePoint[0].node.x += this.fixX;
        this.firePoint[0].node.y += this.fixY;
        this.firePoint[1].node.x += this.fixX;
        this.firePoint[1].node.y += this.fixY;

        //设置子弹数量以及射击间隔
        this.ammoNum = GunInfo[id][3];
        this.fireInterval = GunInfo[id][5];
        //设置枪的起始位置和旋转重置
        this.gun[0].position = cc.v2(0, (cc.winSize.height * -0.5) + 20);
        this.gun[1].position = cc.v2(cc.winSize.width, (cc.winSize.height * -0.5) + 20);
        this.gun[0].rotation = 0;
        this.gun[1].rotation = 0;

        //重置枪的起始水平速度和垂直速度，初始化摩擦力和重力
        this.xSpeed = 0;
        this.ySpeed = 1500;
        this.force = -1800;
        this.xForce = 50;
        this.roSpeed = 0;
        this.roForce = GunInfo[this.gunId][8]*GunInfo[this.gunId][9];

        return this.ammoNum;
    },

    shoot() {
        if (this.isDead) {
            return;
        }
        //射击间隔
        var now = (new Date()).valueOf();
        now = now * 0.001;
        if ((now - this.fireTime) < this.fireInterval || this.ammoNum <= 0) {
            if (this.ammoNum <= 0 && (now - this.fireTime) > this.fireInterval) {
                window.gameApplication.soundManager.playSound("reLoad");
                this.good.color = cc.color(255, 0, 0);
                this.good.opacity = 150;
                this.good.runAction(cc.fadeOut(0.1));
                window.gameApplication.shakeSreen(window.gameApplication.gameView.node);
                //没子弹的音效每隔0.3秒可以播放一次
                this.fireTime = (new Date()).valueOf();
                this.fireTime = (this.fireTime * 0.001) + this.fireInterval - 0.5;
            }
            return;
        }
        window.gameApplication.soundManager.playSound("" + this.gunId);
        this.firePoint[0].playSprites("fire_", 6, 0, 0, 30, false);
        this.firePoint[1].playSprites("fire_", 6, 0, 0, 30, false);
        this.fireTime = (new Date()).valueOf();
        this.fireTime = this.fireTime * 0.001;

        this.ammoNum = this.ammoNum - 1;

        //枪的当前旋转角获取
        var ro = this.gun[0].rotation % 360;

        //y轴的速度设定
        if ((ro > -90 || ro < -270) && (ro <= 90 || ro >= 270)) {
            var val = (GunInfo[this.gunId][2] / GunInfo[this.gunId][1]) * 800;
            this.ySpeed = val;
            if (Math.abs(this.ySpeed - val) < 50) {
                this.ySpeed = val + 100;
            }
        }/* else if(this.ySpeed > 0){
            this.ySpeed = 0;
        } */

        //闪光特效处理
        if (((ro > 345 || ro < -345) || (ro < 15 && ro > -15))) {
            this.good.color = cc.color(255, 255, 255);
            this.good.opacity = 200;
            this.good.runAction(cc.fadeOut(0.3));
        }

        //枪的旋转方向以及X轴的加速度设定
        var roval = GunInfo[this.gunId][8];
        if (ro < 0) {
            if (ro > -180) {
                this.roSpeed = -roval;
                if (this.xSpeed > 350) {
                    this.xSpeed = -350;
                } else {
                    this.xSpeed = this.xSpeed - 350;
                    if (this.xSpeed < -500) {
                        this.xSpeed = -500;
                    }
                }
            } else {
                this.roSpeed = roval;
                if (this.xSpeed < -350) {
                    this.xSpeed = 350;
                } else {
                    this.xSpeed = this.xSpeed + 350;
                    if (this.xSpeed > 500) {
                        this.xSpeed = 500;
                    }
                }
            }
        } else if (ro >= 0) {
            if (ro < 180) {
                this.roSpeed = roval;
                if (this.xSpeed < -350) {
                    this.xSpeed = 350;
                } else {
                    this.xSpeed = this.xSpeed + 350;
                    if (this.xSpeed > 500) {
                        this.xSpeed = 500;
                    }
                }
            } else {
                this.roSpeed = -roval;
                if (this.xSpeed > 350) {
                    this.xSpeed = -350;
                } else {
                    this.xSpeed = this.xSpeed - 350;
                    if (this.xSpeed < -500) {
                        this.xSpeed = -500;
                    }
                }
            }
        }

        this.shootAnim();

        var levelPer = (this.ammoNum / GunInfo[this.gunId][3]);
        window.gameApplication.gameView.ammoVal.width = levelPer * 200;
        window.gameApplication.gameView.ammoText.string = this.ammoNum;
        if (levelPer <= 0.25) {
            window.gameApplication.gameView.ammoVal.color = cc.color(255, 0, 0, 255);
        } else {
            window.gameApplication.gameView.ammoVal.color = cc.color(67, 255, 0, 255);
        }
    },

    shootAnim() {
        var isFire = true;
        var pos1 = this.firePoint[0].node.parent.convertToWorldSpaceAR(this.firePoint[0].node.position);
        var pos2 = this.firePoint[1].node.parent.convertToWorldSpaceAR(this.firePoint[1].node.position);
        var yVal = 1000 * Math.cos(this.gun[0].rotation * angleToRadian);//Y轴偏移量
        var xVal = 1000 * Math.sin(this.gun[0].rotation * angleToRadian);//X轴偏移量 
        this.gunShake(this.gunSprite[0].node);
        this.gunShake(this.gunSprite[1].node);
        while (isFire) {
            if (this.bullets[this.bulletIdx] == null) {
                this.bullets[this.bulletIdx] = cc.find("Canvas/UIView/Bullets/" + this.bulletIdx);
                this.bullets[this.bulletIdx + 1] = cc.find("Canvas/UIView/Bullets/" + (this.bulletIdx + 1));
            }
            if (this.bullets[this.bulletIdx].opacity == 0) {
                isFire = false;
                let b1 = this.bullets[this.bulletIdx];
                b1.rotation = this.gun[0].rotation + 180;
                b1.opacity = 255;
                b1.position = pos1
                b1.runAction(cc.sequence(
                    cc.moveBy(0.3, cc.v2(-xVal, -yVal)),
                    cc.callFunc(function () {
                        b1.opacity = 0;
                    }.bind(this), this)
                ))
                let b2 = this.bullets[this.bulletIdx + 1];
                b2.rotation = this.gun[0].rotation + 180;
                b2.opacity = 255;
                b2.position = pos2
                b2.runAction(cc.sequence(
                    cc.moveBy(0.3, cc.v2(-xVal, -yVal)),
                    cc.callFunc(function () {
                        b2.opacity = 0;
                    }.bind(this), this)
                ))
                if (Math.abs(this.gun[0].x) < cc.winSize.width * 0.5) {
                    b2.opacity = 0;
                } else {
                    b1.opacity = 0;
                }
            }
            this.bulletIdx = this.bulletIdx + 2;
            if (this.bulletIdx == 20) {
                this.bulletIdx = 0;
            }
        }
    },

    gunShake(node) {
        let pos = node.position;
        node.runAction(cc.sequence(
            cc.moveTo(0.02, cc.v2(pos.x-10, pos.y + 10)),
            cc.moveTo(0.02, cc.v2(pos.x+10, pos.y-10)),
            cc.moveTo(0.02, cc.v2(pos.x-10, pos.y + 10)),
            cc.moveTo(0.02, cc.v2(pos.x+10, pos.y-10)),
            cc.callFunc(function(){
                node.position = pos;
            }.bind(this),this)
        )
        );
    },

    update(dt) {
        //死亡处理
        if (!this.isDead) {
            if (this.gun[0].y < (cc.winSize.height * -0.5) - this.gun[0].width) {
                this.isDead = true;
                this.scheduleOnce(function () {
                    this.node.emit('dead', {});
                }.bind(this), 0.5)
            }

            if (this.isShoot) {
                this.shoot();
            }

            //旋转速度大于一定时进行旋转处理
            if (Math.abs(this.roSpeed) > 360) {
                this.roSpeed = (this.roSpeed + ((this.roForce * dt) * (this.roSpeed < 0 ? 1 : -1)));
            }else if(Math.abs(this.roSpeed) > 120){
                this.roSpeed = (this.roSpeed + (0.2*(this.roForce * dt) * (this.roSpeed < 0 ? 1 : -1)));
            }
            this.gun[0].rotation = this.gun[0].rotation + this.roSpeed * dt;
            this.gun[1].rotation = this.gun[0].rotation;

            //Y轴移动处理
            if (this.ySpeed < 0 && this.force > 0) {
                this.ySpeed = 0;
            }
            this.ySpeed = this.ySpeed + this.force * dt;
            if (this.ySpeed < -800) {
                this.ySpeed = -800;
            } else if (this.ySpeed > 2000) {
                this.ySpeed = 2000;
            }

            //上升超过一定位置移动道具背景
            if ((-(this.gun[0].y - 30) < this.gun[0].parent.y) && this.ySpeed > 0) {
                this.node.emit('propDown', { moveVal: this.ySpeed * dt });

                //枪支高度处理并更新分数
                this.height = this.height + this.ySpeed * dt;
                var temp = Math.floor(this.height / (cc.winSize.height * 0.2));
                this.node.emit('updataScore', { score: temp });
            } else {
                this.gun[0].y = this.gun[0].y + this.ySpeed * dt;
                this.gun[1].y = this.gun[0].y;
                this.height = this.height + this.ySpeed * dt;

            }


            if (Math.abs(this.xSpeed) > 50) {
                if (this.xSpeed < 0) {
                    this.xSpeed = this.xSpeed + this.xForce * dt;
                } else {
                    this.xSpeed = this.xSpeed - this.xForce * dt;
                }
            }

            //X轴移动处理
            if (this.xSpeed > 500) {
                this.xSpeed = 500;
            } else if (this.xSpeed < -500) {
                this.xSpeed = -500;
            }

            this.gun[0].x = this.gun[0].x + this.xSpeed * dt;
            this.gun[1].x = this.gun[1].x + this.xSpeed * dt;
            if (Math.abs(this.gun[0].x) > cc.winSize.width) {
                this.gun[0].x = this.gun[0].x + (2 * cc.winSize.width * (this.gun[0].x < 0 ? 1 : -1));
            }
            if (Math.abs(this.gun[1].x) > cc.winSize.width) {
                this.gun[1].x = this.gun[1].x + (2 * cc.winSize.width * (this.gun[1].x < 0 ? 1 : -1))
            }
        }

    },
});
