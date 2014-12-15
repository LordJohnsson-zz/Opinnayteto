Bubble.MainMenu = function(game) {};
Bubble.MainMenu.prototype = {
    create: function() {
        // display images
        this.add.sprite(0, 0, 'background_menu');
        // add the button that will start the game
        this.add.button(Bubble.GAME_WIDTH-300-53, Bubble.GAME_HEIGHT-400-58,'button-start', this.startGame, this, 0, 0, 1);
        // add button click sound effect
        this._buttonSoundClick = this.game.add.audio('buttonClick');
        // add music to main menu
        this._mainMenu = this.game.add.audio('mainMenu');
        this._mainMenu.play("",0,1,true,false);
    },
    startGame: function() {
        this._mainMenu.stop();
        this._buttonSoundClick.play();
        // start the Game state
        this.state.start('Game');
    }
};