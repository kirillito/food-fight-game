var ASSET_URL = "/assets/"

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 640,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('floor', ASSET_URL + 'floor.png');
  this.load.image('floor', ASSET_URL + 'food-tomato.png');
  this.load.spritesheet('player1', ASSET_URL + 'player1.png',
    { 
      frameWidth: 32, 
      frameHeight: 48 
    });
}

function create ()
{
  // Create ground tiles
  this.add.tileSprite(400, 320, 800, 640, 'floor');
}

function update ()
{
}


/*
//We first initialize the phaser game object
var WINDOW_WIDTH = 800;
var WINDOW_HEIGHT = 640;
var game = new Phaser.Game(
  WINDOW_WIDTH, 
  WINDOW_HEIGHT, 
  Phaser.AUTO, 
  "", 
  {
    preload: preload,
    create: create,
    update: GameLoop
  });

var WORLD_SIZE = { w: 800, h: 640 };

var ground_tiles = [];
var bullet_array = [];

var player = {
  sprite: null, //Will hold the sprite when it's created
  speed_x: 0, // This is the speed it's currently moving at
  speed_y: 0,
  speed: 0.5, // This is the parameter for how fast it should move
  friction: 0.95,
  shot: false,
  update: function() {
    // Lerp rotation towards mouse
    var dx = game.input.mousePointer.x + game.camera.x - this.sprite.x;
    var dy = game.input.mousePointer.y + game.camera.y - this.sprite.y;
    var angle = Math.atan2(dy, dx) - Math.PI / 2;
    var dir = (angle - this.sprite.rotation) / (Math.PI * 2);
    dir -= Math.round(dir);
    dir = dir * Math.PI * 2;
    this.sprite.rotation += dir * 0.1;

    // Move forward
    if (
      game.input.keyboard.isDown(Phaser.Keyboard.W) ||
      game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
      game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
    ) {
      this.speed_x +=
        Math.cos(this.sprite.rotation + Math.PI / 2) * this.speed;
      this.speed_y +=
        Math.sin(this.sprite.rotation + Math.PI / 2) * this.speed;
    }

    this.sprite.x += this.speed_x;
    this.sprite.y += this.speed_y;

    this.speed_x *= this.friction;
    this.speed_y *= this.friction;

    // Shoot bullet
    if (game.input.activePointer.leftButton.isDown && !this.shot) {
      var speed_x = Math.cos(this.sprite.rotation + Math.PI / 2) * 20;
      var speed_y = Math.sin(this.sprite.rotation + Math.PI / 2) * 20;
      var bullet = {};
      bullet.speed_x = speed_x;
      bullet.speed_y = speed_y;
      bullet.sprite = game.add.sprite(
        this.sprite.x + bullet.speed_x,
        this.sprite.y + bullet.speed_y,
        "bullet"
      );
      bullet_array.push(bullet);
      this.shot = true;
    }
    if (!game.input.activePointer.leftButton.isDown) this.shot = false;

    // To make player flash when they are hit, set player.spite.alpha = 0
    if (this.sprite.alpha < 1) {
      this.sprite.alpha += (1 - this.sprite.alpha) * 0.16;
    } else {
      this.sprite.alpha = 1;
    }
  }
};

function CreateShip(type, x, y, angle) {
  // type is an int that can be between 1 and 6 inclusive
  // returns the sprite just created
  var sprite = game.add.sprite(x, y, "ship" + String(type) + "_1");
  sprite.rotation = angle;
  sprite.anchor.setTo(0.5, 0.5);
  return sprite;
}

function preload() {
  game.load.crossOrigin = "Anonymous"; // Allows us to load the sprites off the CDN server
  game.stage.backgroundColor = "#3399DA";

  // Load all the ships
  for (var i = 1; i <= 6; i++) {
    game.load.image(
      "ship" + String(i) + "_1",
      ASSET_URL + "ship" + String(i) + "_1.png"
    );
    game.load.image(
      "ship" + String(i) + "_2",
      ASSET_URL + "ship" + String(i) + "_2.png"
    );
    game.load.image(
      "ship" + String(i) + "_3",
      ASSET_URL + "ship" + String(i) + "_3.png"
    );
    game.load.image(
      "ship" + String(i) + "_4",
      ASSET_URL + "ship" + String(i) + "_4.png"
    );
  }

  game.load.image("bullet", ASSET_URL + "cannon_ball.png");
  game.load.image("ground", ASSET_URL + "ground_tile.png");
}

function create() {
  // Create ground tiles
  for (var i = 0; i <= WORLD_SIZE.w / 64 + 1; i++) {
    for (var j = 0; j <= WORLD_SIZE.h / 64 + 1; j++) {
      var tile_sprite = game.add.sprite(i * 64, j * 64, "ground");
      tile_sprite.anchor.setTo(0.5, 0.5);
      tile_sprite.alpha = 0.5;
      ground_tiles.push(tile_sprite);
    }
  }

  // Create player
  var player_ship_type = String(1);
  player.sprite = game.add.sprite(
    (Math.random() * WORLD_SIZE.w) / 2 + WORLD_SIZE.w / 2,
    (Math.random() * WORLD_SIZE.h) / 2 + WORLD_SIZE.h / 2,
    "ship" + player_ship_type + "_1"
  );
  player.sprite.anchor.setTo(0.5, 0.5);

  game.world.setBounds(0, 0, WORLD_SIZE.w, WORLD_SIZE.h);

  game.camera.x = player.sprite.x - WINDOW_WIDTH / 2;
  game.camera.y = player.sprite.y - WINDOW_HEIGHT / 2;
}

function GameLoop() {
  player.update();

  // Move camera with player
  var camera_x = player.sprite.x - WINDOW_WIDTH / 2;
  var camera_y = player.sprite.y - WINDOW_HEIGHT / 2;
  game.camera.x += (camera_x - game.camera.x) * 0.08;
  game.camera.y += (camera_y - game.camera.y) * 0.08;

  // Update bullets
  for (var i = 0; i < bullet_array.length; i++) {
    var bullet = bullet_array[i];
    bullet.sprite.x += bullet.speed_x;
    bullet.sprite.y += bullet.speed_y;
    // Remove if it goes too far off screen
    if (
      bullet.sprite.x < -10 ||
      bullet.sprite.x > WORLD_SIZE.w ||
      bullet.sprite.y < -10 ||
      bullet.sprite.y > WORLD_SIZE.h
    ) {
      bullet.sprite.destroy();
      bullet_array.splice(i, 1);
      i--;
    }
  }
}
*/