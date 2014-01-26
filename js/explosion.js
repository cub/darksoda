uneExplosion = function (x, y) {
    
    this.sprite = darksoda.game.add.sprite(x, y, 'spritesheet');
    this.sprite.animations.add('explosion', Phaser.Animation.generateFrameNames('explosion', 0, 3, '', 4), 1, false);
    this.sprite.animations.play('explosion', 10, false, true );
    
    this.sprite.anchor.setTo(0.5, 0.5);
    
    return this.sprite;

}
uneExplosion.prototype = {}