import k from "./kaplayCtx";
import game from "./scenes/game";
import gameOver from "./scenes/gameover";
import mainMenu from "./scenes/mainMenu";

// loading in various sprites
k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
k.loadSprite("platforms", "graphics/platforms.png");
k.loadSprite("lava", "graphics/lava.png");
k.loadSprite("small-lava", "graphics/small_lava.png");
k.loadSprite("sonic", "graphics/sonic.png", {
  sliceX: 8,
  sliceY: 6,
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 30 },
    jump: { from: 8, to: 15, loop: true, speed: 100 },
    transform: { from: 16, to: 29, speed: 30 },
    superRun: { from: 30, to: 35, loop: true, speed: 15 },
    superJump: { from: 36, to: 47, loop: true, speed: 100 },
  },
});

//Todo: add super sonic sprite (transform, run, jump, untransform)

k.loadSprite("ring", "graphics/ring.png", {
  sliceX: 16,
  sliceY: 1,
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 30 },
  },
});
k.loadSprite("motobug", "graphics/motobug.png", {
  sliceX: 5,
  sliceY: 1,
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 8 },
  },
});

k.loadFont("mania", "fonts/mania.ttf");

k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("ring", "sounds/Ring.wav");
k.loadSound("chemical-plant", "sounds/chemicalPlant.mp3");
k.loadSound("game-over", "sounds/gameOver.mp3");
k.loadSound("super-sonic", "sounds/superSonic.mp3");
//Todo: add super sonic music from sonic 2

// main menu screen
k.scene("main-menu", mainMenu);

k.scene("game", game);

k.scene("gameover", gameOver);

k.go("main-menu");
