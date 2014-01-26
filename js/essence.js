uneEssence = function (x, y, color, infected) {

    this.colorPossible = ['bleu', 'vert', 'orange', 'jaune', 'rose', 'rouge'];

    this.isInfected = infected;
    this.color = this.colorPossible[color]; // blue - orange - green - ... ??

    this.sprite = darksoda.game.add.sprite(0, 0, 'spritesheet');
    this.sprite.animations.add('bleu', Phaser.Animation.generateFrameNames('bleu', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('bleuInfecte', Phaser.Animation.generateFrameNames('bleuInfec', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('rose', Phaser.Animation.generateFrameNames('rose', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('roseInfecte', Phaser.Animation.generateFrameNames('roseInfec', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('orange', Phaser.Animation.generateFrameNames('orange', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('orangeInfecte', Phaser.Animation.generateFrameNames('orangeInfec', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('jaune', Phaser.Animation.generateFrameNames('jaune', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('jauneInfecte', Phaser.Animation.generateFrameNames('jauneInfec', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('vert', Phaser.Animation.generateFrameNames('vert', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('vertInfecte', Phaser.Animation.generateFrameNames('vertInfec', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('rouge', Phaser.Animation.generateFrameNames('rouge', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('rougeInfecte', Phaser.Animation.generateFrameNames('rougeInfec', 0, 0, '', 4), 1, false);
    this.sprite.animations.add('neutre', Phaser.Animation.generateFrameNames('neutre', 0, 0, '', 4), 1, false);
    this.sprite.animations.play("neutre");

    this.sprite.body.setSize(15, 15, 0, 0);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.body.collideWorldBounds = false;
    this.sprite.x = x;
    this.sprite.rotation = darksoda.game.rnd.integerInRange(0, 180);
    this.sprite.body.velocity.y = y;
    this.sprite.body.angularVelocity = darksoda.game.rnd.integerInRange(-50, 50);

    this.sprite.obj = this;

    return this.sprite;

}

uneEssence.prototype = {

    changeToScanned: function () {

        if (this.isInfected) {
            switch (this.color) {
            case "bleu":
                this.sprite.animations.play("bleuInfecte");
                break;
            case "rose":
                this.sprite.animations.play("roseInfecte");
                break;
            case "orange":
                this.sprite.animations.play("orangeInfecte");
                break;
            case "jaune":
                this.sprite.animations.play("jauneInfecte");
                break;
            case "vert":
                this.sprite.animations.play("vertInfecte");
                break;
            case "rouge":
                this.sprite.animations.play("rougeInfecte");
                break;
            }
        } else {
            switch (this.color) {
            case "bleu":
                this.sprite.animations.play("bleu");
                break;
            case "rose":
                this.sprite.animations.play("rose");
                break;
            case "orange":
                this.sprite.animations.play("orange");
                break;
            case "jaune":
                this.sprite.animations.play("jaune");
                break;
            case "vert":
                this.sprite.animations.play("vert");
                break;
            case "rouge":
                this.sprite.animations.play("rouge");
                break;
            }
        }

    },
    changeToNeutre: function () {
        this.sprite.animations.play("neutre");
    }

}