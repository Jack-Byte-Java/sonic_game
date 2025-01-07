import k from "../kaplayCtx";
import { loadSprites, moveBackground, movePlatform } from "./sprites";
import { makeSonic, collectRing, checkSuper } from "../entitites/sonic";
import { makeCollectable } from "../entitites/collectable";

export default function game() {
  loadSprites();
  k.setGravity(3100);
  let bgMusic = k.play("chemical-plant", { volume: 0.2, loop: true });
  let superMusic = false;
  let gameSpeed = 300;

  let ringCount = 0;
  let isSuper = false;

  let score = 0;
  let scoreMulitplier = 0;

  let curPit = null;

  const superText = k.add([
    k.text("RIGHT CLICK TO TRANSFORM INTO SUPER SONIC", {
      font: "mania",
      size: 60,
    }),
    k.pos(0, 200),
  ]);

  const scoreText = k.add([k.text("SCORE: 0", { font: "mania", size: 72 })]);
  const ringText = k.add([
    k.text("RINGS: 0", { font: "mania", size: 72 }),
    k.pos(0, 100),
  ]);

  function destroyEnemy(enemy, scoreMulitplier) {
    k.play("destroy", { volume: 0.5 });
    k.play("hyper-ring", { volume: 0.5 });
    k.destroy(enemy);
    score += 10 * scoreMulitplier;
    scoreText.text = `SCORE: ${score}`;
    //ring ui text is null by default as defined in the sonic object
    //updates it when sonic kills an enemy
    if (scoreMulitplier == 1) {
      sonic.ringCollectUI.text = "+10";
    } else {
      sonic.ringCollectUI.text = `+${scoreMulitplier * 10}`;
    }
  }

  const sonic = makeSonic(k.vec2(200, 745), "run");
  // sends the rings count to sonic so it knows when it
  // can transform into super sonic
  sonic.setControls(ringCount);
  // plays sonic's running animation and
  // and when he untransform back into regular sonic
  sonic.setEvents();
  // game needs to know if sonic is super sonic
  // sonic will update the game if he is
  isSuper = sonic.setTransform(ringCount);

  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      // k.play("jump", { volume: 0.5 });
      if (isSuper) {
        sonic.play("superJump");
      } else {
        sonic.play("jump");
      }
      sonic.jump();
      scoreMulitplier++;
      destroyEnemy(enemy, scoreMulitplier);

      k.wait(1, () => (sonic.ringCollectUI.text = ""));
      return;
    } else if (isSuper) {
      destroyEnemy(enemy, 1);
      k.wait(1, () => (sonic.ringCollectUI.text = ""));
      return;
    }

    k.play("hurt", { volume: 0.5 });

    k.setData("current-score", score);

    k.go("gameover", bgMusic);
  });

  sonic.onCollide("ring", (ring) => {
    k.play("ring", { volume: 0.5 });
    k.destroy(ring);
    score++;
    ringCount++;
    scoreText.text = `SCORE: ${score}`;
    ringText.text = `RINGS: ${ringCount}`;
    sonic.ringCollectUI.text = "+1";
    collectRing(ringCount);
    k.wait(1, () => (sonic.ringCollectUI.text = ""));
  });

  k.loop(4, () => {
    gameSpeed += 50;
  });

  const spawnCollectable = (
    sprite,
    animation,
    pos,
    tag,
    startWait,
    endWait,
    rectPos,
    height,
    width
  ) => {
    const collectable = new makeCollectable(
      sprite,
      animation,
      pos,
      tag,
      rectPos,
      height,
      width
    );
    collectable.onUpdate(() => {
      if (gameSpeed < 3000 && tag == "enemy") {
        collectable.move(-(gameSpeed + 300), 0);
        return;
      }
      collectable.move(-gameSpeed, 0);
    });

    collectable.onExitScreen(() => {
      if (collectable.pos.x < 0) {
        k.destroy(collectable);
      }
    });
    collectable.onCollide("pit", () => {
      k.destroy(collectable);
    });
    const waitTime = k.rand(startWait, endWait);
    k.wait(waitTime, () =>
      spawnCollectable(
        sprite,
        animation,
        pos,
        tag,
        startWait,
        endWait,
        rectPos,
        height,
        width
      )
    );
  };


  spawnCollectable(
    "motobug",
    "run",
    k.vec2(1950, 773),
    "enemy",
    0.5,
    2.5,
    k.vec2(-5, 0),
    32,
    32
  );


  spawnCollectable(
    "ring",
    "spin",
    k.vec2(1950, 745),
    "ring",
    0.5,
    3,
    null,
    null,
    null
  );

  let platform = k.add([
    k.rect(1920, 3000),
    k.opacity(0),
    k.area(),
    k.pos(0, 832),
    k.body({
      isStatic: true,
    }),
  ]);

  function changeMusic(isSuper) {
    // console.log(isSuper)
    if (isSuper && !superMusic) {
      superMusic = true;
      bgMusic.paused = true;
      bgMusic = k.play("super-sonic", { volume: 0.2, loop: true });
    }
    if (!isSuper && superMusic) {
      superMusic = false;
      bgMusic.paused = true;
      bgMusic = k.play("chemical-plant", { volume: 0.2, loop: true });
    }
  }

  let lastRingReductionTime = 0;

  function reduceRings() {
    if (isSuper && ringCount > 0) {
      ringCount--;
      ringText.text = `RINGS: ${ringCount}`;
      if (ringCount <= 0) {
        isSuper = false;
      }
    }
    collectRing(ringCount);
  }

  k.onUpdate(() => {
    //Resets score multiplier when grounded
    if (sonic.isGrounded()) {
      scoreMulitplier = 0;
    }
    //checks if super sonic is active
    isSuper = checkSuper();

    //changes music when super sonic is active
    changeMusic(isSuper);

    //reduces rings 1 per second when super sonic is active
    const currentTime = k.time();
    if (isSuper && currentTime - lastRingReductionTime >= 1) {
      reduceRings();
      lastRingReductionTime = currentTime;
    }

    moveBackground(sonic);
    let platforms = movePlatform(gameSpeed, true);
    for (let i = 0; i < platforms.length; i++) {
      if (platforms[i].is("pit") && !curPit && platforms[i].pos.x > 0) {
        curPit = k.add([
          k.pos(k.vec2(platforms[i].pos.x + 270, platforms[i].pos.y + 380)),
          k.rect(350, 50),
          "pit",
          k.area(),
          k.opacity(0),
          k.anchor("center"),
        ]);
        console.log("created a pit hitbox at pos", platforms[i].pos.x);
      }
    }
    if (curPit && curPit.pos.x < 0) {
      k.destroy(curPit);
      curPit = null;
    }
    if (curPit) {
      curPit.move(-gameSpeed, 0);
    }
  });

  sonic.onCollide("pit", () => {
    platform.isStatic = false;
    if (!sonic.isGrounded()) {
      platform.gravityScale = 30;
      platform.pos.y = 5000;
      k.play("hurt", { volume: 0.5 });
    } else {
      k.wait(0.5, () => {
        k.play("hurt", { volume: 0.5 });
      });
      
    }
    
    k.wait(0.5, () => {
      k.setData("current-score", score);
      k.go("gameover", bgMusic);
    });
  });
}
