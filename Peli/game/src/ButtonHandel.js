

// In-game pause -menu
var PausePanel = function(game, parent){
	Phaser.Group.call(this,game,parent);
	var panelX = (Bubble.GAME_WIDTH/2)-147;
	var buttonSoundClick = game.add.audio('buttonClick');
	
	// create in-game menu board
	this.panel = this.create(panelX, 50, 'pauseMenu');
	this.panel.anchor.setTo(0.5, 0);
	
	// create settings menu
	this.settings = new SettingsPanel(game,(this.panel.y+this.panel.height-3));
	game.add.existing(this.settings);
	this.settings.visible = false;
	this.settings.btnSounds.visible = false;

	this.btnSetup = this.game.add.button(panelX-150, 120, 'button-setup', function(){
		// add sound effect to onClick
		buttonSoundClick.play();
		// show settings menu
		if (!this.settings.visible){
			this.settings.visible = true;
			this.settings.btnSounds.visible = true;
		}
		else{
			this.settings.visible = false;
			this.settings.btnSounds.visible = false;

		}
	}, this,0,0,1)
	// add button to in-game menu
	this.add(this.btnSetup);

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

	this.btnReload = this.game.add.button(this.game._width/2-95, 205, 'button-reload', function(){
		buttonSoundClick.play();
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	this.btnMainMenu = this.game.add.button(this.game._width/2-5, 205, 'button-toMainMenu', function(){
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
	this.panel = this.create(100, 100, 'gameWon');
	
	this.btnReload = this.game.add.button(this.game._width/2-95, 205, 'button-reload', function(){
		buttonSoundClick.play();
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	this.btnMainMenu = this.game.add.button(this.game._width/2-5, 205, 'button-toMainMenu', function(){
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

// In-game winning menu
var SettingsPanel = function(game,panelY, parent){
	Phaser.Group.call(this,game,parent);
	var buttonSoundClick = game.add.audio('buttonClick');
	var infoFont = SetFontStyleExpression();
	this.infoText = game.add.text(game.world.centerX-200, game.world.centerY-50, "TestiäTestiä", infoFont);
	this.infoText.visible = false;
	// Game won panel
	this.panel = this.create((Bubble.GAME_WIDTH/2)-145, panelY, 'settings');

	this.btnSounds = game.add.sprite(this.panel.x, this.panel.y+15, 'button-soundOn', 0);
	this.btnSounds.inputEnabled = true;
	this.btnSounds.events.onInputDown.add(this.musicSet, this);
	this.btnInfo = this.game.add.button(this.panel.x, this.btnSounds.y+85, 'button-info', function(){
		buttonSoundClick.play();
		if (!this.infoText.visible) {
			this.infoText.visible = true;
		}
		else{
			this.infoText.visible = false;
		}
	}, this,0,0,0);
	this.add(this.btnInfo);
};

SettingsPanel.prototype = Object.create(Phaser.Group.prototype);
SettingsPanel.constructor = SettingsPanel;

SettingsPanel.prototype.musicSet = function(game){
	if (true) {};
	if (this.btnSounds.key=="button-soundOn"){
		this.btnSounds.loadTexture("button-soundOff");
	}
	else{
		this.btnSounds.loadTexture("button-soundOn");
	}
};