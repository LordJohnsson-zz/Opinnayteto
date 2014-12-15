

// In-game pause -menu
var PausePanel = function(game, parent){
	Phaser.Group.call(this,game,parent);
	var buttonSoundClick = game.add.audio('buttonClick');
	var panelX = (Bubble.GAME_WIDTH/2)-147;

	// create in-game menu board
	this.panel = this.create(panelX, 50, 'pauseMenu');
	this.panel.anchor.setTo(0.5, 0);
	
	// resume game -button
	this.btnPlay = this.game.add.button(panelX-150, 120, 'button-continue', function(){
		// add sound effect to onClick
		buttonSoundClick.play();
		// return to play the current state
		this.game.state.getCurrentState().playGame();
	}, this,0,0,1);
	// add button to in-game menu
	this.add(this.btnPlay);

	// restart game -button
	this.btnReload = this.game.add.button(panelX-45, 120, 'button-reload', function(){
		buttonSoundClick.play();
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	// back to main menu -button 
	this.btnMainMenu = this.game.add.button(panelX+60, 120, 'button-toMainMenu', function(){
		buttonSoundClick.play();
		this.game.state.start("MainMenu");
	}, this, 0,0,1);
	this.add(this.btnMainMenu);

	this.x = panelX;
	this.y = -300;

};

PausePanel.prototype = Object.create(Phaser.Group.prototype);
PausePanel.constructor = PausePanel;

PausePanel.prototype.show = function(){
	this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
};
PausePanel.prototype.hide = function(){
	this.game.add.tween(this).to({y:-300}, 200, Phaser.Easing.Linear.NONE, true);
};

// In-game game over -menu
var GameOverPanel = function(game, parent){
	Phaser.Group.call(this,game,parent);
	var buttonSoundClick = game.add.audio('buttonClick');
	// Game over panel
	this.panel = this.create(100, 100, 'gameOver');

	this.btnReload = this.game.add.button(this.game._width/2-85, 205, 'button-reload', function(){
		buttonSoundClick.play();
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	this.btnMainMenu = this.game.add.button(this.game._width/2, 205, 'button-toMainMenu', function(){
		buttonSoundClick.play();
		this.game.state.start("MainMenu");
	}, this, 0,0,1);
	this.add(this.btnMainMenu);

	this.x = 0;
	this.y = -300;

};

GameOverPanel.prototype = Object.create(Phaser.Group.prototype);
GameOverPanel.constructor = GameOverPanel;

GameOverPanel.prototype.show = function(){
	this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
};
GameOverPanel.prototype.hide = function(){
	this.game.add.tween(this).to({y:-400}, 200, Phaser.Easing.Linear.NONE, true);
};

// In-game winning menu
var GameWonPanel = function(game, parent){
	Phaser.Group.call(this,game,parent);
	var buttonSoundClick = game.add.audio('buttonClick');
	
	// Game won panel
	this.panel = this.create(100, 100, 'gameOver');
	
	this.btnReload = this.game.add.button(this.game._width/2-85, 205, 'button-reload', function(){
		buttonSoundClick.play();
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	this.btnMainMenu = this.game.add.button(this.game._width/2, 205, 'button-toMainMenu', function(){
		buttonSoundClick.play();
		this.game.state.start("MainMenu");
	}, this, 0,0,1);
	this.add(this.btnMainMenu);

	this.x = 0;
	this.y = -300;

};

GameWonPanel.prototype = Object.create(Phaser.Group.prototype);
GameWonPanel.constructor = GameWonPanel;

GameWonPanel.prototype.show = function(){
	this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
};
GameWonPanel.prototype.hide = function(){
	this.game.add.tween(this).to({y:-400}, 200, Phaser.Easing.Linear.NONE, true);
};