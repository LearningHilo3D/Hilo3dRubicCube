import hilo3d, * as Hilo3d from 'hilo3d';
const OrbitControls = require('hilo3d/examples/js/OrbitControls');

const camera = new Hilo3d.PerspectiveCamera({
  far: 100,
  near: 0.1,
  z: 5,
  x: 5,
  y: 5,
  aspect: window.innerWidth/window.innerHeight
});

camera.lookAt({
  x: 0,
  y: 0,
  z: 0
})

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
  const size = 0.95;
  const geometry = new Hilo3d.BoxGeometry({
    width: size,
    height: size,
    depth: size,
  });
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
      transparent: false,
      transparency: 1,
      baseColor: new Hilo3d.Color(1, 1, 1)
    })
  });

  mesh.setScale(0.8);

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

const cubeDict:{
  [key: string]: Hilo3d.Node,
} = {};
for(let x = -1;x <= 1;x ++) {
  for(let y = -1;y <= 1;y ++) {
    for(let z = -1;z <= 1; z++) {
      const colorInfo:any = {};
      if (x === -1) {
        colorInfo.left = colorDict.left;
      } else if (x === 1) {
        colorInfo.right = colorDict.right;
      }

      if (y === -1) {
        colorInfo.bottom = colorDict.bottom;
      } else if (y === 1) {
        colorInfo.top = colorDict.top;
      }

      if (z === -1) {
        colorInfo.back = colorDict.back;
      } else if (z === 1) {
        colorInfo.front = colorDict.front;
      }

      const cube = cubeDict[`${x},${y},${z}`] = createCubeMesh(colorInfo).addTo(cubeContainer);
      cube.setPosition(x, y, z);
      cube.setPivot(-x, -y, -z);
    }
  }
}


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

function getBoxes(type: 'x'|'y'|'z', pos: number) :Hilo3d.Node[]{
  switch(type){
    case 'x':
      return [
        cubeDict[`${pos},-1,-1`],
        cubeDict[`${pos},-1,0`],
        cubeDict[`${pos},-1,1`],

        cubeDict[`${pos},0,-1`],
        cubeDict[`${pos},0,0`],
        cubeDict[`${pos},0,1`],

        cubeDict[`${pos},1,-1`],
        cubeDict[`${pos},1,0`],
        cubeDict[`${pos},1,1`],
      ]
     case 'y':
      return [
        cubeDict[`-1,${pos},-1`],
        cubeDict[`-1,${pos},0`],
        cubeDict[`-1,${pos},1`],

        cubeDict[`0,${pos},-1`],
        cubeDict[`0,${pos},0`],
        cubeDict[`0,${pos},1`],

        cubeDict[`1,${pos},-1`],
        cubeDict[`1,${pos},0`],
        cubeDict[`1,${pos},1`],
      ]
     case 'z':
      return [
        cubeDict[`-1,-1,${pos}`],
        cubeDict[`-1,0,${pos}`],
        cubeDict[`-1,1,${pos}`],

        cubeDict[`0,-1,${pos}`],
        cubeDict[`0,0,${pos}`],
        cubeDict[`0,1,${pos}`],

        cubeDict[`1,-1,${pos}`],
        cubeDict[`1,0,${pos}`],
        cubeDict[`1,1,${pos}`],
      ]
  }
}

async function rotateBoxes(boxes: Hilo3d.Node[], rotation: any):Promise<void> {
  await new Promise<void>((resolve) => {
    Hilo3d.Tween.to(boxes, rotation, {
      duration: 300,
      delay: 0,
      ease:Hilo3d.Tween.Ease.Quad.EaseInOut,
      onComplete: () => {
        resolve();
      }
    });
  });
}

async function runAnimation() {
  for(let i = -1;i <= 1; i ++) {
    await rotateBoxes(getBoxes('x', i), {
     rotationX: 90,
    });

    await rotateBoxes(getBoxes('x', i), {
     rotationX: 0,
    });

    await rotateBoxes(getBoxes('y', i), {
     rotationY: 90,
    });

    await rotateBoxes(getBoxes('y', i), {
     rotationY: 0,
    });

    await rotateBoxes(getBoxes('z', i), {
     rotationZ: 90,
    });

    await rotateBoxes(getBoxes('z', i), {
     rotationZ: 0,
    });
  }
  
  runAnimation();
}

runAnimation();