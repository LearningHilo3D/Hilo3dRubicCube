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
  material: new Hilo3d.BasicMaterial({
    diffuse: new Hilo3d.Color(0.6, 0.9, 0.3),
    lightType: 'NONE'
  })
});
stage.addChild(mesh);