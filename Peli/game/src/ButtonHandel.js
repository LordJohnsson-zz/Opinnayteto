

// In-game pause -menu
var PausePanel = function(game, parent){
	Phaser.Group.call(this,game,parent);
	var buttonSoundClick = game.add.audio('buttonClick');
	var showSetup = false;
	
	// create in-game menu board
	this.panel = this.create(100, 100, 'pauseMenu');

	/*// restart game -button
	this.btnReload = this.game.add.button(panelX-45, 120, 'button-reload', function(){
		buttonSoundClick.play();
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	// back to main menu -button 
	this.btnMainMenu = this.game.add.button(panelX+60, 120, 'button-toMainMenu', function(){
		buttonSoundClick.play();d
		this.game.state.start("MainMenu");
	}, this, 0,0,1);
	this.add(this.btnMainMenu);*/

	this.x = 0;
	this.y = -300;

};

PausePanel.prototype = Object.create(Phaser.Group.prototype);
PausePanel.constructor = PausePanel;

PausePanel.prototype.show = function(){
	this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
};
PausePanel.prototype.hide = function(){
	this.game.add.tween(this).to({y:-400}, 200, Phaser.Easing.Linear.NONE, true);
};

// In-game game over -menu
var GameOverPanel = function(game, parent){
	Phaser.Group.call(this,game,parent);
	var buttonSoundClick = game.add.audio('buttonClick');
	// Game over panel
	this.panel = this.create(100, 100, 'gameOver');

	/*this.btnReload = this.game.add.button(this.game._width/2-95, 205, 'button-reload', function(){
		buttonSoundClick.play();
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	this.btnMainMenu = this.game.add.button(this.game._width/2-5, 205, 'button-toMainMenu', function(){
		buttonSoundClick.play();
		this.game.state.start("MainMenu");
	}, this, 0,0,1);
	this.add(this.btnMainMenu);*/

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
	
	/*this.btnReload = this.game.add.button(this.game._width/2-95, 205, 'button-reload', function(){
		buttonSoundClick.play();
		this.game.state.start("Game");
	}, this,0,0,1);
	this.add(this.btnReload);

	this.btnMainMenu = this.game.add.button(this.game._width/2-5, 205, 'button-toMainMenu', function(){
		buttonSoundClick.play();
		this.game.state.start("MainMenu");
	}, this, 0,0,1);
	this.add(this.btnMainMenu);*/

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
var SettingsPanel = function(game, gameMusic,parent){
	Phaser.Group.call(this,game,parent);
	var buttonSoundClick = game.add.audio('buttonClick');
	
	// old values (Bubble.GAME_WIDTH/2)-145,
	this.panel = this.create(0, 400, 'settings');

	// sound settings button
	this.btnSoundOn = this.game.add.button(this.panel.x, this.panel.y+15, 'button-soundOn', function(){
		game.sound.mute = true;
		this.btnSoundOff.visible=true;
		this.btnSoundOn.visible=false;
	}, this,0,0,0);
	this.add(this.btnSoundOn);
	this.btnSoundOff = this.game.add.button(this.panel.x, this.panel.y+15, 'button-soundOff', function(){
		game.sound.mute = false;
		this.btnSoundOff.visible=false;
		this.btnSoundOn.visible=true;
	}, this,0,0,0);
	this.add(this.btnSoundOff);

	if (this.game.sound.mute){
		this.btnSoundOff.visible=true;
		this.btnSoundOn.visible=false;
	}
	else{
		this.btnSoundOff.visible=false;
		this.btnSoundOn.visible=true;
	}

	// information text button
	var infoFont = SetFontStyleInfo();
	var itxt = "Laske laskulaatikossa esitetty tehtävä pallojen numeroiden avulla. Voit yhdistellä ja jakaa palloja, mikäli et löydä vastausta täsmäävää lukua. Yhdistämisessä käytettävän operaattorin näet ruudun ylälaidasta. Hauskaa laskentaa!"
	this.infoText = game.add.text(100, game.world.centerY+50, itxt, infoFont);
	this.infoText.wordWrap = true;
	this.infoText.wordWrapWidth = 500;
	this.infoText.visible = false;
	
	this.btnInfo = this.game.add.button(this.panel.x, this.btnSoundOn.y+85, 'button-info', function(){
		buttonSoundClick.play();
		if (!this.infoText.visible) {
			this.infoText.visible = true;
		}
		else{
			this.infoText.visible = false;
		}
	}, this,0,0,0);
	this.add(this.btnInfo);

	this.x = -200;
	this.y = 0;
};

SettingsPanel.prototype = Object.create(Phaser.Group.prototype);
SettingsPanel.constructor = SettingsPanel;

SettingsPanel.prototype.show = function(){
	this.game.add.tween(this).to({x:0}, 500, Phaser.Easing.Bounce.Out, true);
};
SettingsPanel.prototype.hide = function(){
	this.game.add.tween(this).to({x:-200}, 200, Phaser.Easing.Linear.NONE, true);
};