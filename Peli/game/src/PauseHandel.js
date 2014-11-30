var PauseButton = function(game, parent){
	Phaser.Group.call(this,game,parent);

	var panelX = (Bubble.GAME_WIDTH/2)-147;

	// create in-game menu board
	this.panel = this.create(panelX, 50, 'pauseMenu');
	this.panel.anchor.setTo(0.5, 0);

	// resume game button; Old y-value 150
	this.btnPlay = this.game.add.button(panelX-150, 120, 'button-continue', function(){
		// return to play the current state
		this.game.state.getCurrentState().playGame();
	}, this,0,0,1);
	// add button to in-game menu
	this.add(this.btnPlay);

	this.btnReload = this.game.add.button(panelX-45, 120, 'button-reload', function(){
		// get load state before restarting game
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	this.btnMainMenu = this.game.add.button(panelX+60, 120, 'button-toMainMenu', function(){
		this.game.state.start("MainMenu", true, false);
	}, this, 0,0,1);
	this.add(this.btnMainMenu);
	

	this.x = panelX;
	this.y = -300;
};

PauseButton.prototype = Object.create(Phaser.Group.prototype);
PauseButton.constructor = PauseButton;

PauseButton.prototype.show = function(){
	this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
};
PauseButton.prototype.hide = function(){
	this.game.add.tween(this).to({y:-300}, 200, Phaser.Easing.Linear.NONE, true);
};