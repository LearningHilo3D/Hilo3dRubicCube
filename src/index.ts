import hilo3d, * as Hilo3d from 'hilo3d';
const OrbitControls = require('hilo3d/examples/js/OrbitControls');

const camera = new Hilo3d.PerspectiveCamera({
  far: 100,
  near: 0.1,
  z: 7,
  aspect: window.innerWidth/window.innerHeight
});

const stage = new Hilo3d.Stage({
  camera,
  width: window.innerWidth,
  height: window.innerHeight,
  container: document.querySelector('#gameContainer'),
  clearColor: new Hilo3d.Color().fromHEX('ddbea8'),
});
stage.enableDOMEvent([Hilo3d.browser.POINTER_START, Hilo3d.browser.POINTER_MOVE, Hilo3d.browser.POINTER_END], true);

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

stage.addChild(new Hilo3d.AmbientLight({
  color: new Hilo3d.Color(1, 1, 1),
  amount: 1,
}));


function createCubeMesh(colorCfg:{
  [key: string]: Hilo3d.Color
} = {}, defaultColor:Hilo3d.Color = new Hilo3d.Color(.1, .1, .1)):Hilo3d.Mesh {
  const geometry = new Hilo3d.BoxGeometry();
  geometry.colors = new Hilo3d.GeometryData(new Float32Array(3 * 4 * 8), 3);
  ['right', 'left', 'top', 'bottom', 'front', 'back'].forEach((face, index) => {
    const color = colorCfg[face] || defaultColor;
    let colorIndex = index * 4;
    geometry.colors.set(colorIndex, color);
    geometry.colors.set(++colorIndex, color);
    geometry.colors.set(++colorIndex, color);
    geometry.colors.set(++colorIndex, color);
  });

  const mesh = new Hilo3d.Mesh({
    geometry,
    material: new Hilo3d.PBRMaterial({
      transparent: true,
      transparency: 0.8,
      baseColor: new Hilo3d.Color(1, 1, 1)
    })
  });

  mesh.setScale(0.95);
  //
  // mesh.onUpdate = () => {
  //   mesh.rotationX += 2;
  //   mesh.rotationY += 2;
  // };
  return mesh;
}


const colorDict = {
  left: new Hilo3d.Color().fromHEX('ff595e'),
  right: new Hilo3d.Color().fromHEX('f0134d'),
  top: new Hilo3d.Color().fromHEX('3e64ff'),
  bottom: new Hilo3d.Color().fromHEX('o55a5b'),
  front: new Hilo3d.Color().fromHEX('ffd369'),
  back: new Hilo3d.Color().fromHEX('edddd4'),
}

const cubeContainer = new Hilo3d.Node();
stage.addChild(cubeContainer);

cubeContainer.on(Hilo3d.browser.POINTER_START, (e: any) => {
  const target = e.eventTarget;
  if (target.isMesh) {
    console.log(target);
  }
});

const box222 = createCubeMesh({
  left: colorDict.left,
  bottom: colorDict.bottom,
  back: colorDict.back,
}).addTo(cubeContainer);
box222.setPosition(-1, -1, -1);

const box220 = createCubeMesh({
  left: colorDict.left,
  bottom: colorDict.bottom,
}).addTo(cubeContainer);
box220.setPosition(-1, -1, 0);

const box221 = createCubeMesh({
  left: colorDict.left,
  bottom: colorDict.bottom,
  front: colorDict.front,
}).addTo(cubeContainer);
box221.setPosition(-1, -1, 1);

const box202 = createCubeMesh({
  left: colorDict.left,
  back: colorDict.back,
}).addTo(cubeContainer);
box202.setPosition(-1, 0, -1);

const box200 = createCubeMesh({
  left: colorDict.left,
}).addTo(cubeContainer);
box200.setPosition(-1, 0, 0);

const box201 = createCubeMesh({
  left: colorDict.left,
  front: colorDict.front,
}).addTo(cubeContainer);
box201.setPosition(-1, 0, 1);

var box212 = createCubeMesh({
  left: colorDict.left,
  top: colorDict.top,
  back: colorDict.back,
}).addTo(cubeContainer);
box212.setPosition(-1, 1, -1);

var box210 = createCubeMesh({
  left: colorDict.left,
  top: colorDict.top,
}).addTo(cubeContainer);
box210.setPosition(-1, 1, 0);

var box211 = createCubeMesh({
  left: colorDict.left,
  top: colorDict.top,
  front: colorDict.front,
}).addTo(cubeContainer);
box211.setPosition(-1, 1, 1)

var box022 = createCubeMesh({
  bottom: colorDict.bottom,
  back: colorDict.back,
}).addTo(cubeContainer);
box022.setPosition(0, -1, -1);

var box020 = createCubeMesh({
  bottom: colorDict.bottom,
}).addTo(cubeContainer);
box020.setPosition(0, -1, 0);

var box021 = createCubeMesh({
  bottom: colorDict.bottom,
  front: colorDict.front,
}).addTo(cubeContainer);
box021.setPosition(0, -1, 1);

var box002 = createCubeMesh({
  back: colorDict.back,
}).addTo(cubeContainer);
box002.setPosition(0, 0, -1);

var box000 = createCubeMesh({}).addTo(cubeContainer);
box000.setPosition(0, 0, 0);

var box001 = createCubeMesh({
  front: colorDict.front,
}).addTo(cubeContainer);
box001.setPosition(0, 0, 1);

var box012 = createCubeMesh({
  top: colorDict.top,
  back: colorDict.back,
}).addTo(cubeContainer);
box012.setPosition(0, 1, -1);

var box010 = createCubeMesh({
  top: colorDict.top,
}).addTo(cubeContainer);
box010.setPosition(0, 1, 0);

var box011 = createCubeMesh({
  top: colorDict.top,
  front: colorDict.front,
}).addTo(cubeContainer);
box011.setPosition(0, 1, 1);

var box122 = createCubeMesh({
  right: colorDict.right,
  bottom: colorDict.bottom,
  back: colorDict.back,
}).addTo(cubeContainer);
box122.setPosition(1, -1, -1);

var box120 = createCubeMesh({
  right: colorDict.right,
  bottom: colorDict.bottom,
}).addTo(cubeContainer);
box120.setPosition(1, -1, 0);

var box121 = createCubeMesh({
  right: colorDict.right,
  bottom: colorDict.bottom,
  front: colorDict.front,
}).addTo(cubeContainer);
box121.setPosition(1, -1, 1)

var box102 = createCubeMesh({
  right: colorDict.right,
  back: colorDict.back,
}).addTo(cubeContainer);
box102.setPosition(1, 0, -1);

var box100 = createCubeMesh({
  right: colorDict.right,
}).addTo(cubeContainer);
box100.setPosition(1, 0 ,0);

var box101 = createCubeMesh({
  right: colorDict.right,
  front: colorDict.front,
  
}).addTo(cubeContainer);
box101.setPosition(1, 0, 1);

var box112 = createCubeMesh({
  right: colorDict.right,
  top: colorDict.top,
  back: colorDict.back,
}).addTo(cubeContainer);
box112.setPosition(1, 1, -1)


var box110 = createCubeMesh({
  right: colorDict.right,
  top: colorDict.top,
}).addTo(cubeContainer);
box110.setPosition(1, 1, 0)

const box111 = createCubeMesh({
  right: colorDict.right,
  top: colorDict.top,
  front: colorDict.front,
}).addTo(cubeContainer);
box111.setPosition(1, 1, 1);


Hilo3d.Tween
.to(box101, {
  // x:1,
  // y:2,
  // z:3,
  rotationX:360,
}, {
  duration:1000,
  delay:500,
  ease:Hilo3d.Tween.Ease.Quad.EaseIn
});

//  easing类型：
//  In ==> easeIn，加速，先慢后快
//  Out ==> easeOut，减速，先快后慢
//  InOut ==> easeInOut，前半段加速，后半段减速
// easing函数：
//  Linear ==> 线性匀速运动效果
//  Quadratic ==> 二次方的缓动
//  Cubic ==> 三次方的缓动
//  Sinusoidal ==> 正弦曲线的缓动
//  Exponential ==> 指数曲线的缓动
//  Circular ==> 圆形曲线的缓动
//  Bounce ==> 指数衰减的反弹缓动


