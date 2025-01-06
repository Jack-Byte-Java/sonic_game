import k from "../kaplayCtx";
import { makeSonic } from "../entitites/sonic";
import { moveBackground, movePlatform, loadSprites } from "./sprites";

// main menu of the game
export default function mainMenu() {
  if (!k.getData("best-score")) {
    k.setData("best-score", 0);
  }
  // function to get into the game when main menu is clicked
  k.onButtonPress("jump", () => k.go("game"));

  // load background and platform sprites
  loadSprites();

  const sonic = makeSonic(k.vec2(200, 752), "run");

  k.onUpdate(() => {
    moveBackground(sonic);
    movePlatform(4000, false);
  });

  k.add([
    k.text("Sonic Ring Run", { font: "mania", size: "96" }),
    k.pos(k.center().x, 200),
    k.anchor("center"),
  ]);

  k.add([
    k.text("Press Space/Click/Touch to Play", { font: "mania", size: "32"}),
    k.pos(k.center().x, k.center().y - 200),
    k.anchor("center"),
  ]);

  

  
    
}
