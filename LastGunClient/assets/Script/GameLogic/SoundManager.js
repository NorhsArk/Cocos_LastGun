cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
        btn_click: {
            url: cc.AudioClip,
            default: null
        },
        reLoad:{
            url: cc.AudioClip,
            default: null
        },
        speedUp: {
            url: cc.AudioClip,
            default: null
        },
        money: {
            url: cc.AudioClip,
            default: null
        },
        takeGun: {
            url: cc.AudioClip,
            default: null
        },
        gun0: {
            url: cc.AudioClip,
            default: null
        },
        gun1: {
            url: cc.AudioClip,
            default: null
        },
        gun2: {
            url: cc.AudioClip,
            default: null
        },
        gun3: {
            url: cc.AudioClip,
            default: null
        },
        gun4: {
            url: cc.AudioClip,
            default: null
        },
        gun5: {
            url: cc.AudioClip,
            default: null
        },
        gun6: {
            url: cc.AudioClip,
            default: null
        },
        gun7: {
            url: cc.AudioClip,
            default: null
        },
        gun8: {
            url: cc.AudioClip,
            default: null
        },
        gun9: {
            url: cc.AudioClip,
            default: null
        },
        isOpen: true,
        isVoiceOpen: true,
    },

    // LIFE-CYCLE CALLBACKS: 

    playSound: function (soundtype) {
        if (this.isOpen) {
            switch (soundtype) {
                case "btn_click":
                    cc.audioEngine.play(this.btn_click, false, 1);
                    break;
                case "reLoad":
                    cc.audioEngine.play(this.reLoad, false, 1);
                    break;
                case "speedUp":
                    cc.audioEngine.play(this.speedUp, false, 1);
                    break;
                case "money":
                    cc.audioEngine.play(this.money, false, 0.1);
                    break;
                case "takeGun":
                    cc.audioEngine.play(this.takeGun, false, 1);
                    break;
                case "0":
                    cc.audioEngine.play(this.gun0, false, 1);
                    break;
                case "1":
                    cc.audioEngine.play(this.gun1, false, 1);
                    break;
                case "2":
                    cc.audioEngine.play(this.gun2, false, 1);
                    break;
                case "3":
                    cc.audioEngine.play(this.gun3, false, 1);
                    break;
                case "4":
                    cc.audioEngine.play(this.gun4, false, 1);
                    break;
                case "5":
                    cc.audioEngine.play(this.gun5, false, 1);
                    break;
                case "6":
                    cc.audioEngine.play(this.gun6, false, 1);
                    break;
                case "7":
                    cc.audioEngine.play(this.gun7, false, 1);
                    break;
                case "8":
                    cc.audioEngine.play(this.gun8, false, 1);
                    break;
                case "9":
                    cc.audioEngine.play(this.gun9, false, 1);
                    break;

            }
        }
    },

    playBg: function () {
        if (this.isOpen) {
            this.audioSource.play();
        }
    },

    setVoiceIsOpen: function (isOpen) {
        this.isVoiceOpen = isOpen;
        if (isOpen) {
            try {
                if (str != null) {
                    HiboGameJs.enableMic(0)
                }
            } catch (e) {

            }
        } else {
            try {
                if (str != null) {
                    HiboGameJs.enableMic(1)
                }
            } catch (e) {

            }
        }

    },

    setIsOpen: function (isOpen) {
        this.isOpen = isOpen;
        if (this.isOpen) {
            this.playBg();
            try {
                if (str != null) {
                    HiboGameJs.mute(0)
                }
            } catch (e) {

            }

        } else {
            this.audioSource.pause();
            try {
                if (str != null) {
                    HiboGameJs.mute(1)
                }
            } catch (e) {

            }
        }
    },
});
