Bubble.Preload = function(game){
    // define width and height of the game
    Bubble.GAME_WIDTH = 600;
    Bubble.GAME_HEIGHT = 800;
};
Bubble.Preload.prototype = {
    preload: function() {
        // set background color and preload image
        this.stage.backgroundColor = '#0E6F28';
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
        this.load.image('gameOver', 'assets/peliloppui.png');
        this.load.image('gameWon','assets/voitit.png');
        this.load.image('settings', 'assets/settings_panel.png');
        this.load.image('FloorBox', 'assets/BG_FloorBox.png');
        this.load.image('pauseMenu', 'assets/pauseMenu.png');
        // load spritesheets
        this.load.spritesheet('bubblesBlue', 'assets/Bubbles.png', 100, 100);
        this.load.spritesheet('createBlue', 'assets/createBlue.png', 100, 100);
        this.load.spritesheet('bubblesRed', 'assets/Bubbles2.png', 100, 100);
        this.load.spritesheet('createRed', 'assets/createRed.png', 100, 100);
        this.load.spritesheet('bubblesGreen', 'assets/Bubbles3.png', 100, 100);
        this.load.spritesheet('createGreen', 'assets/createGreen.png', 100, 100);
        this.load.spritesheet('bubblesViolet', 'assets/Bubbles4.png', 100, 100);
        this.load.spritesheet('createViolet', 'assets/createViolet.png', 100, 100);
        this.load.spritesheet('ville-idle','assets/ville_idle.png', 102, 191);
        this.load.spritesheet('button-start','assets/button-start.png', 210, 67);
        this.load.spritesheet('button-pause','assets/pause_button.png', 100, 100);
        this.load.spritesheet('button-continue','assets/continue.png', 100, 100);
        this.load.spritesheet('button-setup','assets/setup.png', 85, 85);
        this.load.spritesheet('button-reload','assets/reload.png', 85, 85);
        this.load.spritesheet('button-toMainMenu','assets/backToMenu.png', 85, 85);
        this.load.spritesheet('button-info','assets/settings_info.png', 85, 85);
        this.load.spritesheet('button-soundOn','assets/settings_musicOn.png', 85, 85);
        this.load.spritesheet('button-soundOff','assets/settings_musicOff.png', 85, 85);
        this.load.spritesheet('ville_hp','assets/ville_robot_hp.png', 32, 60);
        this.load.spritesheet('score_star','assets/star.png', 44, 44);
        // load audio
        this.load.audio('bubble_appear', 'assets/audio/bubble2.mp3');
        this.load.audio('buttonClick', 'assets/audio/button-click.mp3');
        this.load.audio('gameOver', 'assets/audio/game-over.mp3');
        this.load.audio('counter', 'assets/audio/counter.mp3');
        this.load.audio('bubbleMain', 'assets/audio/bubbles.mp3');
        this.load.audio('winGame', 'assets/audio/winGame.mp3');
        this.load.audio('getStar', 'assets/audio/getStar.mp3');
        this.load.audio('wrongAnswer', 'assets/audio/wrongAnswer.mp3');
        this.load.audio('mainMenu', 'assets/audio/mainMenu.mp3');
    },
    create: function() {
        this.state.start('MainMenu');
    }
};
