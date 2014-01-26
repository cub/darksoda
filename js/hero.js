unPlayer = function (keyboard) {
    this.keyboardsetup = keyboard;
    this.speed = 200;
    this.sprite = null;
    this.mode = "shoot"; // shoot - scan - aspi - infect
    this.vie = 3;
    this.nbScan = 3;
    this.isRalenti = false;
    this.prevMode = "shoot";
    this.lastScanned = 0;
    this.lastInfected = 0;
    this.historyEssence = ["neutre", "neutre", "neutre", "neutre", "neutre"];

    this.combo = ["neutre", "neutre", "neutre", "neutre", "neutre"];

    this.bulletTime = 0;
}

unPlayer.prototype = {

    init: function () {

        this.sprite = darksoda.game.add.sprite(0, 0, 'spritesheet');
        this.sprite.animations.add('vaisseau_infecte', Phaser.Animation.generateFrameNames('vaisseau_infecte', 0, 2, '', 4), 10, true);
        this.sprite.animations.add('vaisseau_scan', Phaser.Animation.generateFrameNames('vaisseau_scan', 0, 10, '', 4), 10, true);
        this.sprite.animations.add('vaisseau_tir', Phaser.Animation.generateFrameNames('vaisseau_tir', 0, 2, '', 4), 10, true);
        this.sprite.animations.add('vaisseau_aspi', Phaser.Animation.generateFrameNames('vaisseau_aspi', 0, 10, '', 4), 10, true);
        this.sprite.animations.play("vaisseau_tir");


        // placement selon le player
        if (this.keyboardsetup === 0) {
            this.sprite.x = 190;
        } else {
            this.sprite.x = 590;
        }
        this.sprite.y = 550;
        this.sprite.body.setSize(20, 20, 0, 0);
        this.sprite.anchor.setTo(0.5, 0.42);
        this.sprite.body.collideWorldBounds = true;
    },


    pushHistoryEssence: function (essence) {
        //console.log(essence);
        this.historyEssence.pop();
        this.historyEssence.unshift(essence.color);
        //console.log(this.historyEssence);
    },

    setInfected: function () {
        this.lastScanned = 0;
        if (this.mode === "scan") {
            if (this.keyboardsetup === 0) {
                darksoda.recGauche.alpha = 0.5;
                darksoda.game.add.tween(darksoda.recGauche).to({
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true, 0);
            } else {
                darksoda.recDroit.alpha = 0.5;
                darksoda.game.add.tween(darksoda.recDroit).to({
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true, 0);
            }
        }
        this.lastInfected = darksoda.game.time.now;
        this.sprite.animations.play("vaisseau_infecte");
        this.speed = 50;
        this.prevMode = this.mode;
        this.mode = "infect";
    },

    update: function () {

        /*
┌─────────────────────────────────────────────────────────────────────────────┐
│ ██▓▒░ MODE iNFECT ░▒▓██████████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────────────────────┘
  */
        if (this.mode === "infect" && darksoda.game.time.now - this.lastInfected > 5000) {
            //console.log('fin dinfection, prevmode: '+this.prevMode);
            this.speed = 200;
            switch (this.prevMode) {
            case "shoot":
                this.sprite.animations.play("vaisseau_tir");
                this.mode = this.prevMode;
                break;
            case "aspi":
                this.sprite.animations.play("vaisseau_aspi");
                this.mode = this.prevMode;
                break;
            case "scan":
                this.sprite.animations.play("vaisseau_tir");
                this.mode = "shoot";
                break;
            }
        }

        /*
┌─────────────────────────────────────────────────────────────────────────────┐
│ ██▓▒░ MODE SCAN ░▒▓████████████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────────────────────┘
  */

        if (this.mode === "scan" && darksoda.game.time.now - this.lastScanned > 5000) {
            if (this.keyboardsetup === 0) {
                darksoda.recGauche.alpha = 0.5;
                darksoda.game.add.tween(darksoda.recGauche).to({
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true, 0);
            } else {
                darksoda.recDroit.alpha = 0.5;
                darksoda.game.add.tween(darksoda.recDroit).to({
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true, 0);
            }
            switch (this.prevMode) {
            case "shoot":
                this.sprite.animations.play("vaisseau_tir");
                this.mode = this.prevMode;
                break;
            case "aspi":
                this.sprite.animations.play("vaisseau_aspi");
                this.mode = this.prevMode;
                break;
            case "infect":
                this.sprite.animations.play("vaisseau_infecte");
                this.mode = this.prevMode;
                break;
            }
        }



        /*
┌─────────────────────────────────────────────────────────────────────────────┐
│ ██▓▒░ KEYBOARD FiRST ░▒▓███████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────────────────────┘
  */
        this.sprite.body.velocity.setTo(0, 0);
        // french layout azerty keyboard sorry :)
        if (this.keyboardsetup === 0) {
            // deplacement
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.S) && darksoda.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
                // touche contradictoire >_<
            } else if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
                this.sprite.body.velocity.y -= this.speed;
            } else if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                this.sprite.body.velocity.y += this.speed;

            }
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.Q) && darksoda.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                // touche contradictoire >_<
            } else if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
                this.sprite.body.velocity.x -= this.speed;

            } else if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.sprite.body.velocity.x += this.speed;
            }
            // fire
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {

                if (this.mode != "infect") {
                    if (this.mode === "scan") {
                        darksoda.recGauche.alpha = 0.5;
                        darksoda.game.add.tween(darksoda.recGauche).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Linear.None, true, 0);
                    }
                    this.mode = "shoot";
                    this.sprite.animations.play("vaisseau_tir");
                    //  if (this.mode === "shoot") {
                    this.fireBullet();
                    //}
                }


            }
            /*if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.Y)) {
                //console.log('mode shoot..');
                if (this.mode != "infect") {
                    if (this.mode === "scan") {
                        darksoda.recGauche.alpha = 0.5;
                        darksoda.game.add.tween(darksoda.recGauche).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Linear.None, true, 0);
                    }
                    this.mode = "shoot";
                    this.sprite.animations.play("vaisseau_tir");
                }
            }*/
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.U)) {
                //console.log('mode scan..');
                if (this.mode != "infect") {
                    if (this.nbScan > 0 && this.mode != "scan") {
                        this.prevMode = this.mode;
                        this.mode = "scan";
                        this.sprite.animations.play("vaisseau_scan");
                        this.nbScan--;
                        darksoda.refreshIconScan();
                        darksoda.recGauche.alpha = 0.5;
                        darksoda.game.add.tween(darksoda.recGauche).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Linear.None, true, 0);
                        this.lastScanned = darksoda.game.time.now;
                    }
                }
            }
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.I)) {
                //console.log('mode aspi..');
                if (this.mode != "infect") {
                    if (this.mode === "scan") {
                        darksoda.recGauche.alpha = 0.5;
                        darksoda.game.add.tween(darksoda.recGauche).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Linear.None, true, 0);
                    }
                    this.mode = "aspi";
                    this.sprite.animations.play("vaisseau_aspi");
                }
            }
        }
        /*
┌─────────────────────────────────────────────────────────────────────────────┐
│ ██▓▒░ KEYBOARD SECOND ░▒▓██████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────────────────────┘
*/
        else {
            // deplacement
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.UP) && darksoda.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                // touche contradictoire >_<
            } else if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.sprite.body.velocity.y -= this.speed;
            } else if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.sprite.body.velocity.y += this.speed;

            }
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && darksoda.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                // touche contradictoire >_<
            } else if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.sprite.body.velocity.x -= this.speed;

            } else if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.sprite.body.velocity.x += this.speed;
            }
            // fire
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_0)) {
                //console.log('mode shoot..');
                if (this.mode != "infect") {
                    if (this.mode === "scan") {
                        darksoda.recDroit.alpha = 0.5;
                        darksoda.game.add.tween(darksoda.recDroit).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Linear.None, true, 0);
                    }
                    this.mode = "shoot";
                    this.sprite.animations.play("vaisseau_tir");
                    //if (this.mode === "shoot") {
                    this.fireBullet();
                    //}
                }

            }
            /*if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_1)) {
                //console.log('mode shoot..');
                if (this.mode != "infect") {
                    if (this.mode === "scan") {
                        darksoda.recDroit.alpha = 0.5;
                        darksoda.game.add.tween(darksoda.recDroit).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Linear.None, true, 0);
                    }
                    this.mode = "shoot";
                    this.sprite.animations.play("vaisseau_tir");
                }
            }*/
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_2)) {
                //console.log('mode scan..');
                if (this.mode != "infect") {
                    if (this.nbScan > 0 && this.mode != "scan") {
                        this.prevMode = this.mode;
                        this.mode = "scan";
                        this.sprite.animations.play("vaisseau_scan");
                        this.nbScan--;
                        darksoda.refreshIconScan();
                        darksoda.recDroit.alpha = 0.5;
                        darksoda.game.add.tween(darksoda.recDroit).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Linear.None, true, 0);
                        this.lastScanned = darksoda.game.time.now;
                    }
                }
            }
            if (darksoda.game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_3)) {
                //console.log('mode aspi..');
                if (this.mode != "infect") {
                    if (this.mode === "scan") {
                        darksoda.recDroit.alpha = 0.5;
                        darksoda.game.add.tween(darksoda.recDroit).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Linear.None, true, 0);
                    }
                    this.mode = "aspi";
                    this.sprite.animations.play("vaisseau_aspi");
                }
            }

        }

    },

    fireBullet: function () {


        if (this.keyboardsetup === 0) {
            if (darksoda.game.time.now > this.bulletTime) {
                darksoda.bullet = darksoda.bullgroup1.getFirstExists(false);
                if (darksoda.bullet) {
                    darksoda.bullet.reset(this.sprite.x, this.sprite.y - 10);
                    darksoda.bullet.body.velocity.y = -400;
                    this.bulletTime = darksoda.game.time.now + 200;
                }
            }
        } else {
            if (darksoda.game.time.now > this.bulletTime) {
                darksoda.bullet = darksoda.bullgroup2.getFirstExists(false);
                if (darksoda.bullet) {
                    darksoda.bullet.reset(this.sprite.x, this.sprite.y - 10);
                    darksoda.bullet.body.velocity.y = -400;
                    this.bulletTime = darksoda.game.time.now + 200;
                }
            }
        }

    }

}