unParasite = function (x, y, px, py) {
    
    this.sprite = darksoda.game.add.sprite(x, y, 'spritesheet');
    this.sprite.animations.add('parasite', Phaser.Animation.generateFrameNames('parasite', 0, 0, '', 4), 1, false);
    this.sprite.animations.play('parasite');
    
    this.sprite.body.velocity.x = px - x;
    this.sprite.body.velocity.y = py - y;
    
    this.sprite.rotation = Math.atan( (px-x) / (y-py) ) ;
    
    if(y>py){ // si tu es au dessus des monstres
        this.sprite.rotation += 180;
    }
    
    return this.sprite;

}
unParasite.prototype = {}