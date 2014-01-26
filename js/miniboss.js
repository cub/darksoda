unMiniBoss = function (x, y, p) {
    console.log('unMiniBoss..');
    this.sprite = darksoda.game.add.sprite(x, y, 'spritesheet');
    this.sprite.animations.add('boss', Phaser.Animation.generateFrameNames('boss', 0, 0, '', 4), 1, false);
    this.sprite.animations.play('boss');

    this.playername = p;

    this.sprite.width = 10;
    this.sprite.height = 10;

    this.sprite.body.setSize(7, 7, 0, 0);
    this.sprite.anchor.setTo(0.5, 0.5);

    this.sprite.body.velocity.x = darksoda.game.rnd.integerInRange(-100, 100);
    this.sprite.body.velocity.y = darksoda.game.rnd.integerInRange(50, 0);

    this.lastDeplacement = darksoda.game.time.now + 10000;
    this.lastShoot = darksoda.game.time.now + 5000;
    
    this.pv = 3;

    this.sprite.obj = this;

    return this.sprite;
}
unMiniBoss.prototype = {

    update: function () {
        
        if (this.sprite.body.velocity.y < 0) {
            this.sprite.body.velocity.y = 0;
        }

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
        
        if( this.sprite.y > 600 || this.pv === 0){
            this.sprite.obj = null;
            this.sprite.destroy();
            return;
        }


        if ( darksoda.game.time.now > this.lastDeplacement) {
            this.lastDeplacement = darksoda.game.time.now + 10000;
            this.sprite.body.velocity.x = darksoda.game.rnd.integerInRange(-100, 100);
            this.sprite.body.velocity.y = darksoda.game.rnd.integerInRange(50, 0);
        }

        if (darksoda.game.time.now > this.lastShoot) {
            this.lastShoot = darksoda.game.time.now + 5000;
            if (this.playername === "p1") {
                darksoda.parasitegroup1.add(new unParasite(this.sprite.x, this.sprite.y, darksoda.p1.sprite.x, darksoda.p1.sprite.y));
            } else {
                darksoda.parasitegroup2.add(new unParasite(this.sprite.x, this.sprite.y, darksoda.p2.sprite.x, darksoda.p2.sprite.y));
            }
        }

    }

}