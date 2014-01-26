unBonus = function (x, y, p) {

    this.sprite = darksoda.game.add.sprite(x, y, 'spritesheet');
    this.sprite.animations.add('bonus_scan', Phaser.Animation.generateFrameNames('bonus_scan', 0, 0, '', 4), 1, false);
    this.sprite.animations.play('bonus_scan');
    
     this.playername = p;

    this.sprite.width = this.sprite.height = 10;
    
    this.sprite.body.setSize(12, 6, 0, 0);
    this.sprite.anchor.setTo(0.5, 0.5);

    this.sprite.body.velocity.x = darksoda.game.rnd.integerInRange(-100, 100);
    this.sprite.body.velocity.y = darksoda.game.rnd.integerInRange(50, 0);

    this.lastDeplacement = darksoda.game.time.now + 10000;

    this.sprite.obj = this;

    return this.sprite;

}
unBonus.prototype = {
    update: function () {


        if (this.playername === "p1") {
            if (this.sprite.x < 20) {
                this.sprite.body.velocity.x = 50;
            }
            if (this.sprite.x > 380) {
                this.sprite.body.velocity.x = -50;
            }
        } else {
            if (this.sprite.x < 430) {
                this.sprite.body.velocity.x = 50;
            }
            if (this.sprite.x > 780) {
                this.sprite.body.velocity.x = -50;
            }
        }

        if (this.sprite.y > 600 || this.pv === 0) {
            this.sprite.obj = null;
            this.sprite.destroy();
            return;
        }

        if (darksoda.game.time.now > this.lastDeplacement) {
            this.lastDeplacement = darksoda.game.time.now + 10000;
            this.sprite.body.velocity.x = darksoda.game.rnd.integerInRange(-100, 100);
            this.sprite.body.velocity.y = darksoda.game.rnd.integerInRange(50, 0);
        }
    }
}