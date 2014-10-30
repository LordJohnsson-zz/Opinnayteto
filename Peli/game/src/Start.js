Start = function(game){

	this.game = game;
	this.logo = null;

}

Start.prototype = {

	preload: function(){
		this.game.load.image('logo', 'assets/phaser.png');
	},
	create: function(){
		this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);
	},
	update: function(){

	}

};