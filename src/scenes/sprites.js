import k from "../kaplayCtx";

const platformsWidth = 1280;
const bgPieceWidth = 1920;
const platforms = [];
const bgPieces = [];

export function loadSprites() {
  while (platforms.length > 0) {
    platforms.pop();
  }
  if (bgPieces.length == 2) {
    bgPieces.pop();
    bgPieces.pop();
  }
  // background sprite 1
  bgPieces.push(
    k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)])
  );
  // background sprite 2
  bgPieces.push(
    k.add([
      k.sprite("chemical-bg"),
      k.pos(bgPieceWidth * 2, 0),
      k.scale(2),
      k.opacity(0.8),
    ])
  );
  // platform sprite 1
  platforms.push(
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4), "platform"])
  );

  // platform sprite 2
  platforms.push(
    k.add([
      k.sprite("platforms"),
      k.pos(platformsWidth * 4, 450),
      k.scale(4),
      "platform",
    ])
  );
}

export function moveBackground(sonic) {
  // moves the 1st background sprite to the end of the second one
  // happens when the most right bg sprite has moved to the left-end of the screen
  if (bgPieces[1].pos.x < 0) {
    // function to move it in the game display
    bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
    // change the background logic of it
    bgPieces.push(bgPieces.shift());
  }
  // move the most left sprite to the left
  bgPieces[0].move(-100, 0);
  // move the most right sprite to end of the most left sprite
  bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);
  bgPieces[0].moveTo(bgPieces[0].pos.x, -sonic.pos.y / 10 - 50);
  bgPieces[1].moveTo(bgPieces[1].pos.x, -sonic.pos.y / 10 - 50);
}

export function movePlatform(gameSpeed, isGame) {
  let pitWidth = 0;
  let freq = gameSpeed < 500 ? 3 : 5;

  //Destroys the pit once the second platform reaches the left screen
  if (platforms[1].is("pit") && platforms[2].pos.x < 0) {
    k.destroy(platforms[1]);
    platforms.splice(1, 1);
  }

  if (platforms[1].pos.x < 0 && platforms[1].is("platform")) {
    let rand = k.rand(0, 10);
    if (rand >= freq && isGame) {
      console.log("created a pit");
      platforms.push(
        k.add([k.pos([platforms[1].pos.x + platformsWidth * 4]), "pit"])
      );
      pitWidth = 500;
    }
    platforms[0].moveTo(
      platforms[1].pos.x + pitWidth + platformsWidth * 4,
      450
    );
    platforms.push(platforms.shift());
  }
  platforms[0].move(-gameSpeed, 0);
  platforms[1].moveTo(platforms[0].pos.x + platformsWidth * 4, 450);
  if (platforms.length >= 3) {
    platforms[2].moveTo(platforms[0].pos.x + 500 + platformsWidth * 4, 450);
  }
  return platforms;
}
