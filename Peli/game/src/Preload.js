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
        this.load.image('background_menu', 'assets/BG_START.png');
        this.load.image('gameOver', 'assets/game-over-panel.png');
        this.load.image('FloorBox', 'assets/BG_FloorBox.png');
        this.load.image('score-bg', 'assets/score-bg.png');
        this.load.image('pauseMenu', 'assets/pauseMenu.png');
        this.load.image('answerBubble', 'assets/Bubble2.png');
        // load spritesheets
        this.load.spritesheet('bubblesBlue', 'assets/Bubbles.png', 100, 100);
        this.load.spritesheet('bubblesRed', 'assets/Bubbles2.png', 100, 100);
        this.load.spritesheet('bubblesGreen', 'assets/Bubbles3.png', 100, 100);
        this.load.spritesheet('bubblesViolet', 'assets/Bubbles4.png', 100, 100);
        this.load.spritesheet('ville-idle','assets/ville_idle.png', 102, 191);
        this.load.spritesheet('button-start','assets/start_button.png', 106, 106);
        this.load.spritesheet('button-pause','assets/pause_button.png', 100, 100);
        this.load.spritesheet('button-continue','assets/continue.png', 85, 85);
        this.load.spritesheet('button-reload','assets/reload.png', 85, 85);
        this.load.spritesheet('button-toMainMenu','assets/backToMenu.png', 85, 85);
        this.load.spritesheet('ville_hp', 'assets/ville_robot_hp.png', 32, 60);
        // load audio
        this.load.audio('bubble_appear', 'assets/audio/bubble2.ogg');
        this.load.audio('buttonClick', 'assets/audio/button-click.ogg');
        this.load.audio('gameOver', 'assets/audio/game-over.ogg');
        this.load.audio('counter', 'assets/audio/counter.ogg');
        this.load.audio('bubbleMain', 'assets/audio/bubbles.ogg');
        this.load.audio('winGame', 'assets/audio/winGame.ogg');
        this.load.audio('getStar', 'assets/audio/getStar.ogg');
        this.load.audio('wrongAnswer', 'assets/audio/wrongAnswer.ogg');
        this.load.audio('mainMenu', 'assets/audio/mainMenu.ogg');
    },
    create: function() {
        this.state.start('MainMenu');
    }
};
