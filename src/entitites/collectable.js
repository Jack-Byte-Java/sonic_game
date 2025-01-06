import k from "../kaplayCtx";

export function makeCollectable(
  sprite,
  animation,
  pos,
  tag,
  rectPos,
  height,
  width,
 
) {
  if (rectPos) {
    var area = k.area({ shape: new k.Rect(rectPos, height, width) });
  } else {
    var area = k.area();
  }
  return k.add([
    k.sprite(sprite, { anim: animation }),
    area,
    k.scale(4),
    k.anchor("center"),
    k.pos(pos),
    k.offscreen(),
    tag,
  ]);
}
