import k from "../kaplayCtx";

let ringCount = 0;
let isSuper = false;

const superCount = 50;

export function makeSonic(pos, mode) {
  isSuper = false;
  ringCount = 0;
  const sonic = k.add([
    k.sprite("sonic", { anim: mode }),
    k.scale(4),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
    k.body({ jumpForce: 1700 }),
    {
      ringCollectUI: null,
      sonicTransform: null,
      setControls() {
        k.onButtonPress("jump", () => {
          if (this.isGrounded()) {
            if (isSuper) {
              this.play("superJump");
            } else {
              this.play("jump");
            }

            this.jump();
            k.play("jump", { volume: 0.5 });
          }
        });
      },
      setEvents() {
        this.onGround(() => {
          if (isSuper) {
            this.play("superRun");
          } else {
            this.play("run");
          }
        });
        k.onUpdate(() => {
          if (ringCount == 0) {
            isSuper = false;
          }
        });
      },
      setTransform() {
        k.onButtonPress("transform", () => {
          console.log(ringCount);
          if (ringCount >= superCount && !isSuper) {
            this.play("transform");
            k.wait(1, () => {
              this.play("superRun");
            });
            isSuper = true;
            console.log("SUPER SONIC!!!!!");
            return true;
          }
          if (!isSuper) {
            sonic.sonicTransform.text = `Need ${
              superCount - ringCount
            } more rings`;
            k.wait(1, () => (this.sonicTransform.text = ""));
          }
          

          console.log("not enough rings");
          return false;
        });

        k.onUpdate(() => {
          if (!isSuper && this.curAnim() === "superRun") {
            this.play("run");
          }
        });
      },
    },
  ]);

  sonic.ringCollectUI = sonic.add([
    k.text("", { font: "mania", size: 24 }),
    k.color(255, 255, 0),
    k.anchor("center"),
    k.pos(10, -10),
  ]);

  sonic.sonicTransform = sonic.add([
    k.text("", { font: "mania", size: 12 }),
    k.color(255, 255, 0),
    k.anchor("center"),
    k.pos(10, -30),
  ]);

  return sonic;
}

export function collectRing(rings) {
  ringCount = rings;
}

export function checkSuper() {
  return isSuper;
}
