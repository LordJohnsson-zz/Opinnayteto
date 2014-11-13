Bubble.MainMenu = function(game) {};
Bubble.MainMenu.prototype = {
    create: function() {
        // display images
        this.add.sprite(0, 0, 'background_menu');
            //this.add.sprite(-130, Bubble.GAME_HEIGHT-514, 'monster-cover');
            //this.add.sprite((Bubble.GAME_WIDTH-395)/2, 60, 'title');
        // add the button that will start the game
        this.add.button(Bubble.GAME_WIDTH-300-53, Bubble.GAME_HEIGHT-400-58,'button-start', this.startGame, this, 0, 0, 1);
    },
    startGame: function() {
        // start the Game state
        this.state.start('Game');
    }
};