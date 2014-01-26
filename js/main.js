/*$(window).on('keydown', function (e) {
    e.preventDefault();
});*/

var DarkSoda = function () {
    this.version = 0.1;
    this.credits = "cubcubcub (code) - Rémy Le Scornet aka RLS (gfx)";

    this.width = 800;
    this.height = 600;

    this.init = false;

    this.p1 = null;
    this.p2 = null;

    this.p1coeur1;
    this.p1coeur2;
    this.p1coeur3;
    this.p2coeur1;
    this.p2coeur2;
    this.p2coeur3;

    this.colorPossible = ['bleu', 'vert', 'orange', 'jaune', 'rose', 'rouge'];

    this.ess1group = null;
    this.ess2group = null;
    this.ess1lastX = 190;
    this.ess2lastX = 390;
    this.lastTime = 0;
    this.intervalEssence = 500;
    this.speedEssence = 100;

    this.sprite_separateur = null;
    this.recGauche;
    this.recDroit;

    this.bonusgroup1 = null;
    this.bonusgroup2 = null;

    this.bullgroup1 = null;
    this.bullgroup2 = null;

    this.parasitegroup1 = null;
    this.parasitegroup2 = null;

    this.bossgroup1 = null;
    this.bossgroup2 = null;
    
    this.explosiongroup = null;

    this.starfield1;
    this.starfield2;
    this.star;
    this.texture1;
    this.texture2;
    this.texture3;
    this.stars = [];

    this.startTime = 0;
    this.timeElapsed = 0;
    
    this.stopped = false;


    // debug is only active on CANVAS
    this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, 'ggj-darksoda', {
        //this.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, 'ggj-darksoda', {
        preload: this.preload,
        create: this.create,
        update: this.update,
        render: this.render
    });





}

DarkSoda.prototype = {
    preload: function () {
        console.log('preload DarkSoda..');
        darksoda.game.stage.backgroundColor = '#111';
        darksoda.game.load.image('screen_start', 'img/screen_start.png');
        darksoda.game.load.image('btn_jouer', 'img/btn_jouer.png');
        darksoda.game.load.image('sprite_separateur', 'img/sprite_separateur.png');
        darksoda.game.load.image('shoot', 'img/shoot.png');
        darksoda.game.load.image('star', 'img/star.png');
        darksoda.game.load.image('starfield', 'img/starfield.png');
        darksoda.game.load.image('winp1', 'img/winp1.png');
        darksoda.game.load.image('winp2', 'img/winp2.png');
        darksoda.game.load.atlasXML('spritesheet', 'img/spritesheet.png', 'img/spritesheet.xml');

    },
    create: function () {
        console.log('create DarkSoda..');
        var screen_start = darksoda.game.add.sprite(0, 0, 'screen_start');
        var btn_jouer = darksoda.game.add.sprite(0, 0, 'btn_jouer');
        btn_jouer.x = (darksoda.width - btn_jouer.width) * 0.10;
        btn_jouer.y = (darksoda.height) * 0.53;
        btn_jouer.inputEnabled = true;
        btn_jouer.events.onInputDown.add(darksoda.initStage, darksoda);
        btn_jouer.input.useHandCursor = true;


    },
    initStage: function () {
        console.log('initStage DarkSoda..');
        darksoda.clearAllStfu();

        this.startTime = darksoda.game.time.now;

        // parallax
        darksoda.starfield1 = darksoda.game.add.tileSprite(0, 0, 400, 600, 'starfield');
        darksoda.starfield2 = darksoda.game.add.tileSprite(400, 0, 400, 600, 'starfield');
        darksoda.star = darksoda.game.add.sprite(0, 0, 'star');
        darksoda.star.visible = true;

        darksoda.texture1 = darksoda.game.add.renderTexture('texture1', 800, 600);
        darksoda.texture2 = darksoda.game.add.renderTexture('texture2', 800, 600);
        darksoda.texture3 = darksoda.game.add.renderTexture('texture3', 800, 600);

        darksoda.game.add.sprite(0, 0, darksoda.texture1);


        darksoda.p1 = new unPlayer(0);
        darksoda.p1.init();
        darksoda.p1.sprite.name = "p1";

        darksoda.p2 = new unPlayer(1);
        darksoda.p2.init();
        darksoda.p2.sprite.name = "p2";

        darksoda.p1.combo = [darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)]];
        darksoda.p2.combo = [darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)]];

        darksoda.game.add.sprite(0, 0, darksoda.texture2);
        darksoda.game.add.sprite(0, 0, darksoda.texture3);

        var t = darksoda.texture1;
        var s = 0.2;

        for (var i = 0; i < 300; i++) {
            if (i == 100) {
                //	With each 100 stars we ramp up the speed a little and swap to the next texture
                s = 0.8;
                t = darksoda.texture2;
            } else if (i == 200) {
                s = 1.5;
                t = darksoda.texture3;
            }

            darksoda.stars.push({
                x: darksoda.game.world.randomX,
                y: darksoda.game.world.randomY,
                speed: s,
                texture: t
            });
        }

        darksoda.bonusgroup1 = darksoda.game.add.group();
        darksoda.bonusgroup1.name = "bonus1";
        darksoda.bonusgroup2 = darksoda.game.add.group();
        darksoda.bonusgroup2.name = "bonus2";

        darksoda.ess1group = darksoda.game.add.group();
        darksoda.ess1group.name = "ess1";
        darksoda.ess2group = darksoda.game.add.group();
        darksoda.ess2group.name = "ess2";

        darksoda.parasitegroup1 = darksoda.game.add.group();
        darksoda.parasitegroup1.name = "para1";
        darksoda.parasitegroup2 = darksoda.game.add.group();
        darksoda.parasitegroup2.name = "para2";

        darksoda.bossgroup1 = darksoda.game.add.group();
        darksoda.bossgroup1.name = "boss1";
        darksoda.bossgroup2 = darksoda.game.add.group();
        darksoda.bossgroup2.name = "boss2";
        

        /*darksoda.bullet = darksoda.game.add.sprite(0, 0, 'spritesheet');
        darksoda.bullet.animations.add('shoot', Phaser.Animation.generateFrameNames('shoot', 0, 0, '', 4), 1, false);
        darksoda.bullet.animations.play("shoot");*/


        darksoda.bullgroup1 = darksoda.game.add.group();
        darksoda.bullgroup1.name = "bullgroup";
        darksoda.bullgroup1.createMultiple(30, 'shoot');
        darksoda.bullgroup1.setAll('anchor.x', 0.5);
        darksoda.bullgroup1.setAll('anchor.y', 1);
        darksoda.bullgroup1.setAll('outOfBoundsKill', true);

        darksoda.bullgroup2 = darksoda.game.add.group();
        darksoda.bullgroup2.name = "bullgroup";
        darksoda.bullgroup2.createMultiple(30, 'shoot');
        darksoda.bullgroup2.setAll('anchor.x', 0.5);
        darksoda.bullgroup2.setAll('anchor.y', 1);
        darksoda.bullgroup2.setAll('outOfBoundsKill', true);

        darksoda.recGauche = darksoda.game.add.graphics(0, 0);
        darksoda.recGauche.beginFill(0xFFFFFF);
        darksoda.recGauche.drawRect(0, 0, 400, 600);
        darksoda.recGauche.alpha = 0;

        darksoda.recDroit = darksoda.game.add.graphics(400, 0);
        darksoda.recDroit.beginFill(0xFFFFFF);
        darksoda.recDroit.drawRect(0, 0, 400, 600);
        darksoda.recDroit.alpha = 0;

        darksoda.game.world.bounds = new Phaser.Rectangle(0, 0, darksoda.width, darksoda.height);

        darksoda.sprite_separateur = this.game.add.sprite((darksoda.width - 20) * 0.5, 0, 'sprite_separateur');
        darksoda.sprite_separateur.body.setSize(20, darksoda.height, 0, 0);
        darksoda.sprite_separateur.anchor.setTo(0, 0);
        darksoda.sprite_separateur.body.immovable = true;

        // gui
        darksoda.p1coeur1 = darksoda.game.add.sprite(20, 20, 'spritesheet');
        darksoda.p1coeur1.animations.add('vie_pleine', Phaser.Animation.generateFrameNames('vie_pleine', 0, 0, '', 4), 1, false);
        darksoda.p1coeur1.animations.add('vie_vide', Phaser.Animation.generateFrameNames('vie_vide', 0, 0, '', 4), 1, false);
        darksoda.p1coeur1.animations.play("vie_pleine");
        darksoda.p1coeur2 = darksoda.game.add.sprite(60, 20, 'spritesheet');
        darksoda.p1coeur2.animations.add('vie_pleine', Phaser.Animation.generateFrameNames('vie_pleine', 0, 0, '', 4), 1, false);
        darksoda.p1coeur2.animations.add('vie_vide', Phaser.Animation.generateFrameNames('vie_vide', 0, 0, '', 4), 1, false);
        darksoda.p1coeur2.animations.play("vie_pleine");
        darksoda.p1coeur3 = darksoda.game.add.sprite(100, 20, 'spritesheet');
        darksoda.p1coeur3.animations.add('vie_pleine', Phaser.Animation.generateFrameNames('vie_pleine', 0, 0, '', 4), 1, false);
        darksoda.p1coeur3.animations.add('vie_vide', Phaser.Animation.generateFrameNames('vie_vide', 0, 0, '', 4), 1, false);
        darksoda.p1coeur3.animations.play("vie_pleine");
        //
        darksoda.p2coeur1 = darksoda.game.add.sprite(430, 20, 'spritesheet');
        darksoda.p2coeur1.animations.add('vie_pleine', Phaser.Animation.generateFrameNames('vie_pleine', 0, 0, '', 4), 1, false);
        darksoda.p2coeur1.animations.add('vie_vide', Phaser.Animation.generateFrameNames('vie_vide', 0, 0, '', 4), 1, false);
        darksoda.p2coeur1.animations.play("vie_pleine");
        darksoda.p2coeur2 = darksoda.game.add.sprite(470, 20, 'spritesheet');
        darksoda.p2coeur2.animations.add('vie_pleine', Phaser.Animation.generateFrameNames('vie_pleine', 0, 0, '', 4), 1, false);
        darksoda.p2coeur2.animations.add('vie_vide', Phaser.Animation.generateFrameNames('vie_vide', 0, 0, '', 4), 1, false);
        darksoda.p2coeur2.animations.play("vie_pleine");
        darksoda.p2coeur3 = darksoda.game.add.sprite(510, 20, 'spritesheet');
        darksoda.p2coeur3.animations.add('vie_pleine', Phaser.Animation.generateFrameNames('vie_pleine', 0, 0, '', 4), 1, false);
        darksoda.p2coeur3.animations.add('vie_vide', Phaser.Animation.generateFrameNames('vie_vide', 0, 0, '', 4), 1, false);
        darksoda.p2coeur3.animations.play("vie_pleine");
        // gui gem combo
        darksoda.p1c1 = darksoda.game.add.graphics(20, 550);
        darksoda.p1c1.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[0]));
        darksoda.p1c1.drawCircle(0, 0, 3);
        darksoda.p1c2 = darksoda.game.add.graphics(40, 550);
        darksoda.p1c2.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[1]));
        darksoda.p1c2.drawCircle(0, 0, 3);
        darksoda.p1c3 = darksoda.game.add.graphics(60, 550);
        darksoda.p1c3.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[2]));
        darksoda.p1c3.drawCircle(0, 0, 3);
        darksoda.p1c4 = darksoda.game.add.graphics(80, 550);
        darksoda.p1c4.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[3]));
        darksoda.p1c4.drawCircle(0, 0, 3);
        darksoda.p1c5 = darksoda.game.add.graphics(100, 550);
        darksoda.p1c5.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[4]));
        darksoda.p1c5.drawCircle(0, 0, 3);
        //
        darksoda.p1e1 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p1e1.width = darksoda.p1e1.height = 20;
        darksoda.p1e1.x = 20;
        darksoda.p1e1.y = 565;
        darksoda.p1e1.body = null;
        darksoda.game.add.sprite(darksoda.p1e1);
        darksoda.p1e2 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p1e2.width = darksoda.p1e2.height = 20;
        darksoda.p1e2.x = 40;
        darksoda.p1e2.y = 565;
        darksoda.p1e2.body = null;
        darksoda.game.add.sprite(darksoda.p1e2);
        darksoda.p1e3 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p1e3.width = darksoda.p1e3.height = 20;
        darksoda.p1e3.x = 60;
        darksoda.p1e3.y = 565;
        darksoda.p1e3.body = null;
        darksoda.game.add.sprite(darksoda.p1e3);
        darksoda.p1e4 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p1e4.width = darksoda.p1e4.height = 20;
        darksoda.p1e4.x = 80;
        darksoda.p1e4.y = 565;
        darksoda.p1e4.body = null;
        darksoda.game.add.sprite(darksoda.p1e4);
        darksoda.p1e5 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p1e5.width = darksoda.p1e5.height = 20;
        darksoda.p1e5.x = 100;
        darksoda.p1e5.y = 565;
        darksoda.p1e5.body = null;
        darksoda.game.add.sprite(darksoda.p1e5);

        // gui gem combo
        darksoda.p2c1 = darksoda.game.add.graphics(430, 550);
        darksoda.p2c1.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[0]));
        darksoda.p2c1.drawCircle(0, 0, 3);
        darksoda.p2c2 = darksoda.game.add.graphics(450, 550);
        darksoda.p2c2.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[1]));
        darksoda.p2c2.drawCircle(0, 0, 3);
        darksoda.p2c3 = darksoda.game.add.graphics(470, 550);
        darksoda.p2c3.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[2]));
        darksoda.p2c3.drawCircle(0, 0, 3);
        darksoda.p2c4 = darksoda.game.add.graphics(490, 550);
        darksoda.p2c4.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[3]));
        darksoda.p2c4.drawCircle(0, 0, 3);
        darksoda.p2c5 = darksoda.game.add.graphics(510, 550);
        darksoda.p2c5.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[4]));
        darksoda.p2c5.drawCircle(0, 0, 3);
        //
        darksoda.p2e1 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p2e1.width = darksoda.p2e1.height = 20;
        darksoda.p2e1.x = 430;
        darksoda.p2e1.y = 565;
        darksoda.p2e1.body = null;
        darksoda.game.add.sprite(darksoda.p2e1);
        darksoda.p2e2 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p2e2.width = darksoda.p2e2.height = 20;
        darksoda.p2e2.x = 450;
        darksoda.p2e2.y = 565;
        darksoda.p2e2.body = null;
        darksoda.game.add.sprite(darksoda.p2e2);
        darksoda.p2e3 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p2e3.width = darksoda.p2e3.height = 20;
        darksoda.p2e3.x = 470;
        darksoda.p2e3.y = 565;
        darksoda.p2e3.body = null;
        darksoda.game.add.sprite(darksoda.p2e3);
        darksoda.p2e4 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p2e4.width = darksoda.p2e4.height = 20;
        darksoda.p2e4.x = 490;
        darksoda.p2e4.y = 565;
        darksoda.p2e4.body = null;
        darksoda.game.add.sprite(darksoda.p2e4);
        darksoda.p2e5 = new uneEssence(20, 0, 'neutre', false);
        darksoda.p2e5.width = darksoda.p2e5.height = 20;
        darksoda.p2e5.x = 510;
        darksoda.p2e5.y = 565;
        darksoda.p2e5.body = null;
        darksoda.game.add.sprite(darksoda.p2e5);

        // gui nb scan
        darksoda.p1b1 = darksoda.game.add.sprite(360, 565, 'spritesheet');
        darksoda.p1b1.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p1b1.animations.play("bonus_scan");
        darksoda.p1b1.width = darksoda.p1b1.height = 5;
        darksoda.p1b2 = darksoda.game.add.sprite(340, 565, 'spritesheet');
        darksoda.p1b2.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p1b2.animations.play("bonus_scan");
        darksoda.p1b2.width = darksoda.p1b2.height = 5;
        darksoda.p1b3 = darksoda.game.add.sprite(320, 565, 'spritesheet');
        darksoda.p1b3.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p1b3.animations.play("bonus_scan");
        darksoda.p1b3.width = darksoda.p1b3.height = 5;
        darksoda.p1b4 = darksoda.game.add.sprite(300, 565, 'spritesheet');
        darksoda.p1b4.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p1b4.animations.play("bonus_scan");
        darksoda.p1b4.width = darksoda.p1b4.height = 5;
        darksoda.p1b5 = darksoda.game.add.sprite(280, 565, 'spritesheet');
        darksoda.p1b5.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p1b5.animations.play("bonus_scan");
        darksoda.p1b5.width = darksoda.p1b5.height = 5;
        //
        darksoda.p2b1 = darksoda.game.add.sprite(760, 565, 'spritesheet');
        darksoda.p2b1.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p2b1.animations.play("bonus_scan");
        darksoda.p2b1.width = darksoda.p2b1.height = 5;
        darksoda.p2b2 = darksoda.game.add.sprite(740, 565, 'spritesheet');
        darksoda.p2b2.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p2b2.animations.play("bonus_scan");
        darksoda.p2b2.width = darksoda.p2b2.height = 5;
        darksoda.p2b3 = darksoda.game.add.sprite(720, 565, 'spritesheet');
        darksoda.p2b3.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p2b3.animations.play("bonus_scan");
        darksoda.p2b3.width = darksoda.p2b3.height = 5;
        darksoda.p2b4 = darksoda.game.add.sprite(700, 565, 'spritesheet');
        darksoda.p2b4.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p2b4.animations.play("bonus_scan");
        darksoda.p2b4.width = darksoda.p2b4.height = 5;
        darksoda.p2b5 = darksoda.game.add.sprite(680, 565, 'spritesheet');
        darksoda.p2b5.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
        darksoda.p2b5.animations.play("bonus_scan");
        darksoda.p2b5.width = darksoda.p2b5.height = 5;

        darksoda.refreshIconScan();
        
        
        darksoda.explosiongroup = darksoda.game.add.group();
        darksoda.explosiongroup.name = "explosion";
                        

        darksoda.lastTime = darksoda.game.time.now;

        darksoda.init = true;
    },
    stringEssenceToColorHexe: function (s) {
        //'bleu', 'vert', 'orange', 'jaune', 'rose', 'rouge'
        var color = '#FFF';
        switch (s) {
        case 'bleu':
            color = 0x9A8DE3;
            break;
        case 'vert':
            color = 0x2BE3B1;
            break;
        case 'orange':
            color = 0xFE8933;
            break;
        case 'jaune':
            color = 0xF9F82B;
            break;
        case 'rose':
            color = 0xE693E6;
            break;
        case 'rouge':
            color = 0xFD1B16;
            break;
        }
        return color;
    },
    refreshHistoryEssencePlayer: function () {
        darksoda.p1e1.animations.play(darksoda.p1.historyEssence[0]);
        darksoda.p1e2.animations.play(darksoda.p1.historyEssence[1]);
        darksoda.p1e3.animations.play(darksoda.p1.historyEssence[2]);
        darksoda.p1e4.animations.play(darksoda.p1.historyEssence[3]);
        darksoda.p1e5.animations.play(darksoda.p1.historyEssence[4]);

        var p1success = 0;
        for (var i = 0; i < 5; i++) {
            if (darksoda.p1.historyEssence[i] === darksoda.p1.combo[i]) {
                p1success++;
            }
        }
        if (p1success === 5) {
            darksoda.p1.combo = [darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)]];

            darksoda.p1c1.clear();
            darksoda.p1c1.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[0]));
            darksoda.p1c1.drawCircle(0, 0, 3);
            darksoda.p1c2.clear();
            darksoda.p1c2.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[1]));
            darksoda.p1c2.drawCircle(0, 0, 3);
            darksoda.p1c3.clear();
            darksoda.p1c3.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[2]));
            darksoda.p1c3.drawCircle(0, 0, 3);
            darksoda.p1c4.clear();
            darksoda.p1c4.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[3]));
            darksoda.p1c4.drawCircle(0, 0, 3);
            darksoda.p1c5.clear();
            darksoda.p1c5.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p1.combo[4]));
            darksoda.p1c5.drawCircle(0, 0, 3);

            darksoda.p1.historyEssence = ['neutre', 'neutre', 'neutre', 'neutre', 'neutre'];

            darksoda.bossgroup2.add(new unBoss(darksoda.game.rnd.integerInRange(430, 780), 0, "p2"));

            darksoda.refreshHistoryEssencePlayer();

        }


        //

        darksoda.p2e1.animations.play(darksoda.p2.historyEssence[0]);
        darksoda.p2e2.animations.play(darksoda.p2.historyEssence[1]);
        darksoda.p2e3.animations.play(darksoda.p2.historyEssence[2]);
        darksoda.p2e4.animations.play(darksoda.p2.historyEssence[3]);
        darksoda.p2e5.animations.play(darksoda.p2.historyEssence[4]);

        var p2success = 0;
        for (var i = 0; i < 5; i++) {
            if (darksoda.p2.historyEssence[i] === darksoda.p2.combo[i]) {
                p2success++;
            }
        }
        if (p2success === 5) {
            darksoda.p2.combo = [darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)], darksoda.colorPossible[darksoda.game.rnd.integerInRange(0, 5)]];

            darksoda.p2c1.clear();
            darksoda.p2c1.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[0]));
            darksoda.p2c1.drawCircle(0, 0, 3);
            darksoda.p2c2.clear();
            darksoda.p2c2.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[1]));
            darksoda.p2c2.drawCircle(0, 0, 3);
            darksoda.p2c3.clear();
            darksoda.p2c3.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[2]));
            darksoda.p2c3.drawCircle(0, 0, 3);
            darksoda.p2c4.clear();
            darksoda.p2c4.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[3]));
            darksoda.p2c4.drawCircle(0, 0, 3);
            darksoda.p2c5.clear();
            darksoda.p2c5.beginFill(darksoda.stringEssenceToColorHexe(darksoda.p2.combo[4]));
            darksoda.p2c5.drawCircle(0, 0, 3);

            darksoda.p2.historyEssence = ['neutre', 'neutre', 'neutre', 'neutre', 'neutre'];

            darksoda.bossgroup1.add(new unBoss(darksoda.game.rnd.integerInRange(430, 780), 0, "p1"));

            darksoda.refreshHistoryEssencePlayer();

        }


    },
    render: function () {
        //console.log('render DarkSoda..');
        if (darksoda.init === true) {
            //darksoda.game.debug.renderSpriteBody(darksoda.p1.sprite);
        }
    },
    update: function () {
        //console.log('update DarkSoda..');
        
        if(darksoda.stopped){
            return;
        }

        darksoda.timeElapsed = darksoda.game.time.now - darksoda.startTime;

        if (darksoda.init === true) {

            darksoda.p1.update();
            darksoda.p2.update();
            // player vs separateur
            darksoda.game.physics.collide(darksoda.p1.sprite, darksoda.sprite_separateur, null, null, darksoda);
            darksoda.game.physics.collide(darksoda.p2.sprite, darksoda.sprite_separateur, null, null, darksoda);
            // player vs essence
            darksoda.game.physics.collide(darksoda.p1.sprite, darksoda.ess1group, darksoda.checkCollisionP1Ess1group, null, darksoda);
            darksoda.game.physics.collide(darksoda.p2.sprite, darksoda.ess2group, darksoda.checkCollisionP2Ess2group, null, darksoda);
            // tir player vs essence
            darksoda.game.physics.collide(darksoda.bullgroup1, darksoda.ess1group, darksoda.checkCollisionBullet1Ess1group, null, darksoda);
            darksoda.game.physics.collide(darksoda.bullgroup2, darksoda.ess2group, darksoda.checkCollisionBullet2Ess2group, null, darksoda);
            // player vs parasite
            darksoda.game.physics.collide(darksoda.p1.sprite, darksoda.parasitegroup1, darksoda.checkCollisionP1Para1group, null, darksoda);
            darksoda.game.physics.collide(darksoda.p2.sprite, darksoda.parasitegroup2, darksoda.checkCollisionP2Para2group, null, darksoda);
            // parasite vs separateur rebond
            darksoda.game.physics.collide(darksoda.parasitegroup1, darksoda.sprite_separateur, darksoda.checkCollisionPara1groupRebond, null, darksoda);
            darksoda.game.physics.collide(darksoda.parasitegroup2, darksoda.sprite_separateur, darksoda.checkCollisionPara2groupRebond, null, darksoda);
            // player vs boss
            darksoda.game.physics.collide(darksoda.p1.sprite, darksoda.bossgroup1, darksoda.checkCollisionP1Boss1group, null, darksoda);
            darksoda.game.physics.collide(darksoda.p2.sprite, darksoda.bossgroup2, darksoda.checkCollisionP2Boss2group, null, darksoda);
            // tir player vs boss
            darksoda.game.physics.collide(darksoda.bullgroup1, darksoda.bossgroup1, darksoda.checkCollisionBullet1Boss1group, null, darksoda);
            darksoda.game.physics.collide(darksoda.bullgroup2, darksoda.bossgroup2, darksoda.checkCollisionBullet2Boss2group, null, darksoda);
            // player vs bonus
            darksoda.game.physics.collide(darksoda.p1.sprite, darksoda.bonusgroup1, darksoda.checkCollisionPlayer1Bonus1group, null, darksoda);
            darksoda.game.physics.collide(darksoda.p2.sprite, darksoda.bonusgroup2, darksoda.checkCollisionPlayer2Bonus2group, null, darksoda);

            darksoda.intervalEssence = 500 - darksoda.timeElapsed / 10000;
            darksoda.speedEssence = 100 + darksoda.timeElapsed / 10000;

            /*
┌─────────────────────────────────────────────────────────────────────────────┐
│ ██▓▒░ UPDATE ADD ESSENCE ░▒▓███████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────────────────────┘
 */
            // creer une essence si il est moment/temps voulu
            if (darksoda.intervalEssence < darksoda.game.time.now - darksoda.lastTime) {
                var breaker = 0;
                var newX = 0;
                breaker = darksoda.game.rnd.integerInRange(0, 5);
                if (breaker > 3) {
                    newX = darksoda.game.rnd.integerInRange(20, 380);
                } else {
                    newX = darksoda.ess1lastX + darksoda.game.rnd.integerInRange(-50, 50);
                }
                if (newX < 20) {
                    newX = 20;
                }
                if (newX > 380) {
                    newX = 380;
                }
                darksoda.ess1lastX = newX;
                darksoda.ess1group.add(new uneEssence(newX, darksoda.speedEssence, darksoda.game.rnd.integerInRange(0, 6), Math.random() < .5));
                if (darksoda.game.rnd.integerInRange(0, 1) === 1) {
                    darksoda.ess1group.add(new uneEssence(darksoda.game.rnd.integerInRange(20, 380), darksoda.speedEssence, darksoda.game.rnd.integerInRange(0, 6), Math.random() < .5));
                }
                if (darksoda.game.rnd.integerInRange(0, 20) === 1) {
                    darksoda.bossgroup1.add(new unMiniBoss(darksoda.game.rnd.integerInRange(20, 380), 0, "p1"));
                }
                if (darksoda.game.rnd.integerInRange(0, 10) === 1) {
                    darksoda.bonusgroup1.add(new unBonus(darksoda.game.rnd.integerInRange(20, 380), 0, "p1"));
                }
                breaker = darksoda.game.rnd.integerInRange(0, 5);
                if (breaker > 3) {
                    newX = darksoda.game.rnd.integerInRange(420, 780);
                } else {
                    newX = darksoda.ess2lastX + darksoda.game.rnd.integerInRange(-50, 50);
                }
                if (newX < 420) {
                    newX = 420;
                }
                if (newX > 780) {
                    newX = 780;
                }
                darksoda.ess2lastX = newX;
                darksoda.ess2group.add(new uneEssence(newX, darksoda.speedEssence, darksoda.game.rnd.integerInRange(0, 6), Math.random() < .5));
                if (darksoda.game.rnd.integerInRange(0, 1) === 1) {
                    darksoda.ess2group.add(new uneEssence(darksoda.game.rnd.integerInRange(430, 380), darksoda.speedEssence, darksoda.game.rnd.integerInRange(0, 6), Math.random() < .5));
                }
                if (darksoda.game.rnd.integerInRange(0, 20) === 1) {
                    darksoda.bossgroup2.add(new unMiniBoss(darksoda.game.rnd.integerInRange(430, 380), 0, "p2"));
                }
                if (darksoda.game.rnd.integerInRange(0, 10) === 1) {
                    darksoda.bonusgroup2.add(new unBonus(darksoda.game.rnd.integerInRange(430, 380), 0, "p2"));
                }
                darksoda.lastTime = darksoda.game.time.now;
            }

            // vide supprimer les essences trop basse
            for (var i = 0; i < darksoda.ess1group.length; i++) {
                var temp = darksoda.ess1group.getAt(i);
                if (temp.y > darksoda.height) {
                    darksoda.ess1group.remove(temp);
                    temp.destroy();
                }
                if (darksoda.p1.mode === "scan") {
                    temp.obj.changeToScanned();
                } else {
                    temp.obj.changeToNeutre();
                }
            }
            for (var i = 0; i < darksoda.ess2group.length; i++) {
                var temp = darksoda.ess2group.getAt(i);
                if (temp.y > darksoda.height) {
                    darksoda.ess2group.remove(temp);
                    temp.destroy();
                }
                if (darksoda.p2.mode === "scan") {
                    temp.obj.changeToScanned();
                } else {
                    temp.obj.changeToNeutre();
                }
            }

            // update pour les boss
            for (var i = 0; i < darksoda.bossgroup1.length; i++) {
                var temp = darksoda.bossgroup1.getAt(i);
                temp.obj.update();
            }
            for (var i = 0; i < darksoda.bossgroup2.length; i++) {
                var temp = darksoda.bossgroup2.getAt(i);
                temp.obj.update();
            }

            // update pour les bonus
            for (var i = 0; i < darksoda.bonusgroup1.length; i++) {
                var temp = darksoda.bonusgroup1.getAt(i);
                temp.obj.update();
            }
            for (var i = 0; i < darksoda.bonusgroup2.length; i++) {
                var temp = darksoda.bonusgroup2.getAt(i);
                temp.obj.update();
            }

            /*
┌─────────────────────────────────────────────────────────────────────────────┐
│ ██▓▒░ FOND PARALLAX ░▒▓████████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────────────────────┘
 */
            darksoda.starfield1.tilePosition.y += 0.1;
            darksoda.starfield2.tilePosition.y += 0.1;

            for (var i = 0; i < 300; i++) {
                //	Update the stars y position based on its speed
                darksoda.stars[i].y += darksoda.stars[i].speed;

                if (darksoda.stars[i].y > 600) {
                    //	Off the bottom of the screen? Then wrap around to the top
                    darksoda.stars[i].x = darksoda.game.world.randomX;
                    darksoda.stars[i].y = -32;
                }

                if (i == 0 || i == 100 || i == 200) {
                    //	If it's the first star of the layer then we clear the texture
                    darksoda.stars[i].texture.renderXY(darksoda.star, darksoda.stars[i].x, darksoda.stars[i].y, true);
                } else {
                    //	Otherwise just draw the star sprite where we need it
                    darksoda.stars[i].texture.renderXY(darksoda.star, darksoda.stars[i].x, darksoda.stars[i].y, false);
                }
            }
        }
    },


    /*
┌─────────────────────────────────────────────────────────────────────────────┐
│ ██▓▒░ COLLiSiON ░▒▓████████████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────────────────────┘
 */
    checkCollisionP1Ess1group: function (obj1, obj2) {

        if (darksoda.p1.mode === "aspi") {
            if (obj2.obj.isInfected === true) {
                darksoda.playerGetHurt(darksoda.p1);
                darksoda.p1.setInfected();
            } else {
                darksoda.p1.pushHistoryEssence(obj2.obj);
                darksoda.refreshHistoryEssencePlayer();
            }
        } else {
            darksoda.playerGetHurt(darksoda.p1);
        }
        
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        
        darksoda.ess1group.remove(obj2);
        obj2.destroy();
       
         
    },
    checkCollisionP2Ess2group: function (obj1, obj2) {
        if (darksoda.p2.mode === "aspi") {
            if (obj2.obj.isInfected === true) {
                darksoda.playerGetHurt(darksoda.p2);
                darksoda.p2.setInfected();
            } else {
                darksoda.p2.pushHistoryEssence(obj2.obj);
                darksoda.refreshHistoryEssencePlayer();
            }
        } else {
            darksoda.playerGetHurt(darksoda.p2);
        }
        
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        
        darksoda.ess2group.remove(obj2);
        obj2.destroy();
    },
    playerUpdateGuiLife: function () {
        if (darksoda.p1.vie === 3) {
            darksoda.p1coeur1.animations.play('vie_pleine');
            darksoda.p1coeur2.animations.play('vie_pleine');
            darksoda.p1coeur3.animations.play('vie_pleine');
        } else
        if (darksoda.p1.vie === 2) {
            darksoda.p1coeur1.animations.play('vie_pleine');
            darksoda.p1coeur2.animations.play('vie_pleine');
            darksoda.p1coeur3.animations.play('vie_vide');
        } else
        if (darksoda.p1.vie === 1) {
            darksoda.p1coeur1.animations.play('vie_pleine');
            darksoda.p1coeur2.animations.play('vie_vide');
            darksoda.p1coeur3.animations.play('vie_vide');
        } else
        if (darksoda.p1.vie === 0) {
            darksoda.p1coeur1.animations.play('vie_vide');
            darksoda.p1coeur2.animations.play('vie_vide');
            darksoda.p1coeur3.animations.play('vie_vide');
            
            //darksoda.clearAllStfu();
            
            //darksoda.game.paused = true;
            darksoda.stopped = true;
            
            var winp2 = darksoda.game.add.sprite(0, 0, 'winp2');
            winp2.x = (darksoda.width - winp2.width)*0.5;
            winp2.y = (darksoda.height - winp2.height)*0.5;
            
            darksoda.explosiongroup.add(new uneExplosion(darksoda.p1.sprite.x, darksoda.p1.sprite.y));
            
            darksoda.p1.sprite.visible = false;
            darksoda.p2.sprite.visible = false;
        }
        //
        if (darksoda.p2.vie === 3) {
            darksoda.p2coeur1.animations.play('vie_pleine');
            darksoda.p2coeur2.animations.play('vie_pleine');
            darksoda.p2coeur3.animations.play('vie_pleine');
        } else
        if (darksoda.p2.vie === 2) {
            darksoda.p2coeur1.animations.play('vie_pleine');
            darksoda.p2coeur2.animations.play('vie_pleine');
            darksoda.p2coeur3.animations.play('vie_vide');
        } else
        if (darksoda.p2.vie === 1) {
            darksoda.p2coeur1.animations.play('vie_pleine');
            darksoda.p2coeur2.animations.play('vie_vide');
            darksoda.p2coeur3.animations.play('vie_vide');
        } else
        if (darksoda.p2.vie === 0) {
            darksoda.p2coeur1.animations.play('vie_vide');
            darksoda.p2coeur2.animations.play('vie_vide');
            darksoda.p2coeur3.animations.play('vie_vide');
            
            //darksoda.clearAllStfu();
            //darksoda.game.paused = true;
            darksoda.stopped = true;
            var winp1 = darksoda.game.add.sprite(0, 0, 'winp1');
            winp1.x = (darksoda.width - winp1.width)*0.5;
            winp1.y = (darksoda.height - winp1.height)*0.5;
            
            darksoda.explosiongroup.add(new uneExplosion(darksoda.p2.sprite.x, darksoda.p2.sprite.y));
            darksoda.p1.sprite.visible = false;
            darksoda.p2.sprite.visible = false;
        }
    },
    playerGetHurt: function (p) {
        p.vie -= 1;
        darksoda.game.add.tween(p.sprite).to({
            alpha: 0
        }, 100, Phaser.Easing.Linear.None, true, 0);
        darksoda.game.add.tween(p.sprite).to({
            alpha: 1
        }, 100, Phaser.Easing.Linear.None, true, 100);
        darksoda.game.add.tween(p.sprite).to({
            alpha: 0
        }, 100, Phaser.Easing.Linear.None, true, 200);
        darksoda.game.add.tween(p.sprite).to({
            alpha: 1
        }, 100, Phaser.Easing.Linear.None, true, 300);

        darksoda.playerUpdateGuiLife();

    },
    checkCollisionBullet1Ess1group: function (obj1, obj2) {

        if (obj2.obj.isInfected) {
            darksoda.parasitegroup1.add(new unParasite(obj2.x, obj2.y, darksoda.p1.sprite.x, darksoda.p1.sprite.y));
        }
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        obj1.kill();
        obj2.destroy();
    },
    checkCollisionBullet2Ess2group: function (obj1, obj2) {
        if (obj2.obj.isInfected) {
            darksoda.parasitegroup2.add(new unParasite(obj2.x, obj2.y, darksoda.p2.sprite.x, darksoda.p2.sprite.x));
        }
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        obj1.kill();
        obj2.destroy();
    },

    checkCollisionP1Para1group: function (obj1, obj2) {
        darksoda.playerGetHurt(darksoda.p1);
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        darksoda.parasitegroup1.remove(obj2);
        obj2.destroy();
    },
    checkCollisionP2Para2group: function (obj1, obj2) {
        darksoda.playerGetHurt(darksoda.p2);
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        darksoda.parasitegroup2.remove(obj2);
        obj2.destroy();
    },
    checkCollisionPara1groupRebond: function (obj1, obj2) {
        obj1.body.velocity.x *= -1;
    },
    checkCollisionPara2groupRebond: function (obj1, obj2) {
        obj1.body.velocity.x *= -1;
    },

    checkCollisionP1Boss1group: function (obj1, obj2) {
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        darksoda.playerGetHurt(darksoda.p1);
        obj2.destroy();
    },
    checkCollisionP2Boss2group: function (obj1, obj2) {
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        darksoda.playerGetHurt(darksoda.p1);
        obj2.destroy();
    },
    checkCollisionBullet1Boss1group: function (obj1, obj2) {
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        obj2.obj.pv--;
        obj1.kill();
    },
    checkCollisionBullet2Boss2group: function (obj1, obj2) {
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        obj2.obj.pv--;
        obj1.kill();
    },
    checkCollisionPlayer1Bonus1group: function (obj1, obj2) {
        if (darksoda.p1.nbScan < 6) {
            darksoda.p1.nbScan++;
            darksoda.refreshIconScan();
        }
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        obj2.destroy();
    },
    checkCollisionPlayer2Bonus2group: function (obj1, obj2) {
        if (darksoda.p2.nbScan < 6) {
            darksoda.p2.nbScan++;
            darksoda.refreshIconScan();
        }
        darksoda.explosiongroup.add(new uneExplosion(obj2.x, obj2.y));
        obj2.destroy();
    },
    refreshIconScan: function () {
        if (darksoda.p1.nbScan === 5) {
            darksoda.p1b1.visible = true;
            darksoda.p1b2.visible = true;
            darksoda.p1b3.visible = true;
            darksoda.p1b4.visible = true;
            darksoda.p1b5.visible = true;
        } else if (darksoda.p1.nbScan === 4) {
            darksoda.p1b1.visible = true;
            darksoda.p1b2.visible = true;
            darksoda.p1b3.visible = true;
            darksoda.p1b4.visible = true;
            darksoda.p1b5.visible = false;
        } else if (darksoda.p1.nbScan === 3) {
            darksoda.p1b1.visible = true;
            darksoda.p1b2.visible = true;
            darksoda.p1b3.visible = true;
            darksoda.p1b4.visible = false;
            darksoda.p1b5.visible = false;
        } else if (darksoda.p1.nbScan === 2) {
            darksoda.p1b1.visible = true;
            darksoda.p1b2.visible = true;
            darksoda.p1b3.visible = false;
            darksoda.p1b4.visible = false;
            darksoda.p1b5.visible = false;
        } else if (darksoda.p1.nbScan === 1) {
            darksoda.p1b1.visible = true;
            darksoda.p1b2.visible = false;
            darksoda.p1b3.visible = false;
            darksoda.p1b4.visible = false;
            darksoda.p1b5.visible = false;
        } else if (darksoda.p1.nbScan === 0) {
            darksoda.p1b1.visible = false;
            darksoda.p1b2.visible = false;
            darksoda.p1b3.visible = false;
            darksoda.p1b4.visible = false;
            darksoda.p1b5.visible = false;
        }
        //
        if (darksoda.p2.nbScan === 5) {
            darksoda.p2b1.visible = true;
            darksoda.p2b2.visible = true;
            darksoda.p2b3.visible = true;
            darksoda.p2b4.visible = true;
            darksoda.p2b5.visible = true;
        } else if (darksoda.p2.nbScan === 4) {
            darksoda.p2b1.visible = true;
            darksoda.p2b2.visible = true;
            darksoda.p2b3.visible = true;
            darksoda.p2b4.visible = true;
            darksoda.p2b5.visible = false;
        } else if (darksoda.p2.nbScan === 3) {
            darksoda.p2b1.visible = true;
            darksoda.p2b2.visible = true;
            darksoda.p2b3.visible = true;
            darksoda.p2b4.visible = false;
            darksoda.p2b5.visible = false;
        } else if (darksoda.p2.nbScan === 2) {
            darksoda.p2b1.visible = true;
            darksoda.p2b2.visible = true;
            darksoda.p2b3.visible = false;
            darksoda.p2b4.visible = false;
            darksoda.p2b5.visible = false;
        } else if (darksoda.p2.nbScan === 1) {
            darksoda.p2b1.visible = true;
            darksoda.p2b2.visible = false;
            darksoda.p2b3.visible = false;
            darksoda.p2b4.visible = false;
            darksoda.p2b5.visible = false;
        } else if (darksoda.p2.nbScan === 0) {
            darksoda.p2b1.visible = false;
            darksoda.p2b2.visible = false;
            darksoda.p2b3.visible = false;
            darksoda.p2b4.visible = false;
            darksoda.p2b5.visible = false;
        }
    },

    /*
┌─────────────────────────────────────────────────────────────────────────────┐
│ ██▓▒░ UTiLZ ░▒▓████████████████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────────────────────┘
 */
    clearAllStfu: function () {
        while (darksoda.game.world.total > 0) {
            darksoda.game.world.getAt(0).destroy();
        }
    }

};

console.log('DarkSoda..');
var darksoda = new DarkSoda();