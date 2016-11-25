$(document).ready(function() {

    var game = new Phaser.Game(600, 500, Phaser.AUTO, 'evasion', { preload: preload, create: create, update: update }, true);
    var player;
    var baddie;
    var baddies = [];
    var cursors, pauseKey, upKey, downKey, leftKey, rightKey;
    var timeCheck, lastBaddieTime;
    var gameOver = false;
    var timer;
    var scoreText;
    var gameOverText;
    var score = 0;

    function preload () {

        game.load.image('player', 'images/playerShip1_green.png');
        game.load.image('baddie', 'images/ufoBlue.png');

    }

    function create () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 100;
        cursors = game.input.keyboard.createCursorKeys();

        // our hero
        player = game.add.sprite(350,350, 'player');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.allowGravity = false;
        player.body.velocity.setTo(0, 0);
        player.body.acceleration.setTo(0, 0);
        player.body.collideWorldBounds = true;
        player.scale.set(.5 , .5 );

        // baddies
        baddies = game.add.group();
        baddies.enableBody = true;
        baddies.physicsBodyType = Phaser.Physics.ARCADE;

        // controls
        pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

        timeCheck = game.time.now;
        lastBaddieTime = game.time.now;

        //  score
        timer = game.time.create(false);
        timer.loop(1000, updateCounter, this);
        timer.start();
        scoreText = game.add.text(32, 10, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
        gameOverText = game.add.text(game.world.centerX, game.world.centerX -100, '', { font: "40px Arial", fill: "#ffffff", align: "center" });
        gameOverText.anchor.setTo(0.5, 0.5);


    }
    function update () {
        if (!gameOver) {
            if (baddies.total < 10 && (game.time.now - lastBaddieTime) > 1000) {
                var spawnX = Math.floor(Math.random()*(game.world.width-0+1)+0);
                baddie = game.add.sprite(spawnX,50, 'baddie');
                baddie.checkWorldBounds = true;
                baddie.outOfBoundsKill = true;
                baddie.scale.set(.5 , .5 );
                baddies.add(baddie);
                lastBaddieTime = game.time.now;
            }

            if (player.alive) {
                player.body.velocity.setTo(0, 0);
                if (leftKey.isDown) {
                    player.body.velocity.x = -400;
                } else if (rightKey.isDown) {
                    player.body.velocity.x = 400;
                } else if (upKey.isDown) {
                    player.body.velocity.y = -400;
                } else if (downKey.isDown) {
                    player.body.velocity.y = 400;
                }

            }
            game.physics.arcade.overlap(baddies, player, collisionHandler, null, this);
            game.debug.text('Score: ' + score);
            timeCheck = game.time.now;
        } else {
            timer.stop();
            baddies.destroy();
            player.kill();
            player.destroy();
            gameOverText.text = 'Game Over!';
            gameOverText.visible = true;
        }

    }
    function collisionHandler (baddie, player) {

        gameOver = true;
    }
    function updateCounter() {

        score +=10;
        scoreText.text = 'score: ' + score;

    }
});
