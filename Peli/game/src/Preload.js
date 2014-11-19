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
        this.load.image('BG1', 'assets/BG_1.png');
        this.load.image('BG2', 'assets/BG_2.png');
        this.load.image('BG3', 'assets/BG_3.png');
        this.load.image('BG4', 'assets/BG_4.png');
        this.load.image('BG5', 'assets/BG_5.png');
        this.load.image('BG6', 'assets/BG_6.png');
        this.load.image('wall_left', 'assets/BG_Left.png')
        this.load.image('wall_right', 'assets/BG_Right.png')
        this.load.image('background_menu', 'assets/BG_START.png');
        this.load.image('floor', 'assets/BG_Ground.png');
        this.load.image('FloorBox', 'assets/BG_FloorBox.png');
        this.load.image('score-bg', 'assets/score-bg.png');
        // load spritesheets
        this.load.spritesheet('bubbles', 'assets/Bubbles.png', 100, 100);
        this.load.spritesheet('monster-idle','assets/monster-idle.png', 103, 131);
        this.load.spritesheet('button-start','assets/start_button.png', 106, 106);
    },
    create: function() {
        // start the MainMenu state
        this.state.start('MainMenu');
    }
};