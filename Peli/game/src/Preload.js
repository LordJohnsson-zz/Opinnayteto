Bubble.Preload = function(game){
    // define width and height of the game
    Bubble.GAME_WIDTH = 600;
    Bubble.GAME_HEIGHT = 800;
};
Bubble.Preload.prototype = {
    preload: function() {
        // set background color and preload image
        this.stage.backgroundColor = '#B4D9E7';
        this.preloadBar = this.add.sprite((Bubble.GAME_WIDTH-300)/2, (Bubble.GAME_HEIGHT-27)/2, 'preloaderBar');
        this.load.setPreloadSprite(this.preloadBar);
        // load images
        this.load.image('background', 'assets/BG_8.png');
        this.load.image('background_menu', 'assets/BG_3.png');
        this.load.image('floor', 'assets/BG__8_Floor.png');
            //this.load.image('monster-cover', 'img/monster-cover.png');
            //this.load.image('title', 'assets/title.png');
            //this.load.image('game-over', 'img/gameover.png');
        this.load.image('score-bg', 'assets/score-bg.png');
            //this.load.image('button-pause', 'img/button-pause.png');
        // load spritesheets
        this.load.spritesheet('bubble', 'assets/Bubble1.png', 100, 98);
        this.load.spritesheet('monster-idle','assets/monster-idle.png', 103, 131);
        this.load.spritesheet('button-start','assets/start_button.png', 106, 106);
    },
    create: function() {
        // start the MainMenu state
        this.state.start('MainMenu');
    }
};