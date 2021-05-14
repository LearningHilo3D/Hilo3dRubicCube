import * as Hilo3d from 'hilo3d';
const OrbitControls = require('hilo3d/examples/js/OrbitControls');

const camera = new Hilo3d.PerspectiveCamera({
  far: 100,
  near: 0.1,
  z: 3,
  aspect: window.innerWidth/window.innerHeight
});

const stage = new Hilo3d.Stage({
  camera,
  width: window.innerWidth,
  height: window.innerHeight,
  container: document.querySelector('#gameContainer'),
});

const ticker = new Hilo3d.Ticker();
ticker.start();
ticker.addTick(stage);
ticker.addTick(Hilo3d.Animation);
ticker.addTick(Hilo3d.Tween);
ticker.start();

const orbitControls = new OrbitControls(stage, {
  isLockMove: true,
  isLockZ: true
});

const mesh = new Hilo3d.Mesh({
  geometry: new Hilo3d.BoxGeometry(),
  material: new Hilo3d.PBRMaterial({
    baseColor: new Hilo3d.Color(0.6, 0.9, 0.3),
  })
});
stage.addChild(mesh);

stage.addChild(new Hilo3d.DirectionalLight({
  color: new Hilo3d.Color(1, 1, 1),
  direction: new Hilo3d.Vector3(0, 1, 0),
  amount: 2,
}));
stage.addChild(new Hilo3d.AmbientLight({
  color: new Hilo3d.Color(1, 1, 1),
  amount: 0.2,
}));

Hilo3d.Tween.to(mesh, {
  rotationX: 180,
  rotationY:180
}, {
  duration: 1500,
  ease: Hilo3d.Tween.Ease.Quad.EaseInOut,
  loop: true,
  reverse: true,
});