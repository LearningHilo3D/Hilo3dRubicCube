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

      var cube = cubeDict[`${x},${y},${z}`] = createCubeMesh(colorInfo).addTo(cubeContainer);
      cube.setPosition(x, y, z);
      cube.setPivot(-x, -y, -z);
    }
  }
}


//  easing?????????
//  In ==> easeIn????????????????????????
//  Out ==> easeOut????????????????????????
//  InOut ==> easeInOut????????????????????????????????????
// easing?????????
//  Linear ==> ????????????????????????
//  Quadratic ==> ??????????????????
//  Cubic ==> ??????????????????
//  Sinusoidal ==> ?????????????????????
//  Exponential ==> ?????????????????????
//  Circular ==> ?????????????????????
//  Bounce ==> ???????????????????????????



//everytime to get position
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

//==============dir???direction,??????????????????====================
function resetBoxes(type: 'x'|'y'|'z', pos: '-1'|'0'|'1' , dir: '-1'|'1'){
if(dir==='-1'){
  if(type==='x'){
    switch(pos){
      // =======type:x ???pos???-1???dir: -1??????=======
      case '-1': 
      {    
        cubeDict[`-1,-1,-1`]=cubeDict[`-1,-1,1`],
        cubeDict[`-1,-1,0`]=cubeDict[`-1,0,1`],
        cubeDict[`-1,-1,1`]=cubeDict[`-1,1,1`],
  
        cubeDict[`-1,0,-1`]= cubeDict[`-1,-1,0`],
        cubeDict[`-1,0,0`]= cubeDict[`-1,0,0`],
        cubeDict[`-1,0,1`]= cubeDict[`-1,1,0`],
  
        cubeDict[`-1,1,-1`]=cubeDict[`-1,-1,-1`],
        cubeDict[`-1,1,0`]=cubeDict[`-1,0,-1`],
        cubeDict[`-1,1,1`]= cubeDict[`-1,1,-1`]
      }
        break;
       // =======type:x???pos???0???dir: -1??????=======
       case '0':
        {
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,0,0`],
          cubeDict[`-1,0,1`],
  
          cubeDict[`0,0,-1`],
          cubeDict[`0,0,0`],
          cubeDict[`0,0,1`],
  
          cubeDict[`1,0,-1`],
          cubeDict[`1,0,0`],
          cubeDict[`1,0,1`]
        
      }
      break;
      // =======type:x???pos???1???dir: -1??????=======
       case '1':
         {
          cubeDict[`-1,-1,-1`],
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,1,-1`],
  
          cubeDict[`0,-1,-1`],
          cubeDict[`0,0,-1`],
          cubeDict[`0,1,-1`],
  
          cubeDict[`1,-1,-1`],
          cubeDict[`1,0,-1`],
          cubeDict[`1,1,-1`]
        }
        break;
  
       default:
         {
          console.log('wrong number');
  
         }
         break;
     }

   }else if(type==='y'){
    switch(pos){
      // =======type:y???pos???-1???dir: -1??????=======
      case '-1': 
      {    
        cubeDict[`-1,-1,-1`]=cubeDict[`-1,-1,1`],
        cubeDict[`-1,-1,0`]=cubeDict[`-1,0,1`],
        cubeDict[`-1,-1,1`]=cubeDict[`-1,1,1`],
  
        cubeDict[`-1,0,-1`]= cubeDict[`-1,-1,0`],
        cubeDict[`-1,0,0`]= cubeDict[`-1,0,0`],
        cubeDict[`-1,0,1`]= cubeDict[`-1,1,0`],
  
        cubeDict[`-1,1,-1`]=cubeDict[`-1,-1,-1`],
        cubeDict[`-1,1,0`]=cubeDict[`-1,0,-1`],
        cubeDict[`-1,1,1`]= cubeDict[`-1,1,-1`]
      }
        break;
        // =======type:y???pos???0???dir: -1??????=======
       case '0':
        {
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,0,0`],
          cubeDict[`-1,0,1`],
  
          cubeDict[`0,0,-1`],
          cubeDict[`0,0,0`],
          cubeDict[`0,0,1`],
  
          cubeDict[`1,0,-1`],
          cubeDict[`1,0,0`],
          cubeDict[`1,0,1`]
        
      }
      break;
      // =======type:y???pos???1???dir: -1??????=======
       case '1':
         {
          cubeDict[`-1,-1,-1`],
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,1,-1`],
  
          cubeDict[`0,-1,-1`],
          cubeDict[`0,0,-1`],
          cubeDict[`0,1,-1`],
  
          cubeDict[`1,-1,-1`],
          cubeDict[`1,0,-1`],
          cubeDict[`1,1,-1`]
        }
        break;
  
       default:
         {
          console.log('wrong number');
  
         }
         break;
     }
  }else if(type==='z'){
    switch(pos){
      // =======type:z???pos???-1???dir: -1??????=======
      case '-1': 
      {    
        cubeDict[`-1,-1,-1`]=cubeDict[`-1,-1,1`],
        cubeDict[`-1,-1,0`]=cubeDict[`-1,0,1`],
        cubeDict[`-1,-1,1`]=cubeDict[`-1,1,1`],
  
        cubeDict[`-1,0,-1`]= cubeDict[`-1,-1,0`],
        cubeDict[`-1,0,0`]= cubeDict[`-1,0,0`],
        cubeDict[`-1,0,1`]= cubeDict[`-1,1,0`],
  
        cubeDict[`-1,1,-1`]=cubeDict[`-1,-1,-1`],
        cubeDict[`-1,1,0`]=cubeDict[`-1,0,-1`],
        cubeDict[`-1,1,1`]= cubeDict[`-1,1,-1`]
      }
        break;
        // =======type:y???pos???0???dir: -1??????=======
       case '0':
        {
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,0,0`],
          cubeDict[`-1,0,1`],
  
          cubeDict[`0,0,-1`],
          cubeDict[`0,0,0`],
          cubeDict[`0,0,1`],
  
          cubeDict[`1,0,-1`],
          cubeDict[`1,0,0`],
          cubeDict[`1,0,1`]
        
      }
      break;
      // =======type:y???pos???1???dir: -1??????=======
       case '1':
         {
          cubeDict[`-1,-1,-1`],
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,1,-1`],
  
          cubeDict[`0,-1,-1`],
          cubeDict[`0,0,-1`],
          cubeDict[`0,1,-1`],
  
          cubeDict[`1,-1,-1`],
          cubeDict[`1,0,-1`],
          cubeDict[`1,1,-1`]
        }
        break;
  
       default:
         {
          console.log('wrong number');
  
         }
         break;
     }
  }else{
    console.log('wrong character');
  }

//   =============???????????????============

}else if(dir==='1'){
  if(type==='x'){
    switch(pos){
      // =======type:x???pos???-1???dir: 1??????=======
      case '-1': 
      {    
        cubeDict[`-1,-1,-1`]=cubeDict[`-1,-1,1`],
        cubeDict[`-1,-1,0`]=cubeDict[`-1,0,1`],
        cubeDict[`-1,-1,1`]=cubeDict[`-1,1,1`],
  
        cubeDict[`-1,0,-1`]= cubeDict[`-1,-1,0`],
        cubeDict[`-1,0,0`]= cubeDict[`-1,0,0`],
        cubeDict[`-1,0,1`]= cubeDict[`-1,1,0`],
  
        cubeDict[`-1,1,-1`]=cubeDict[`-1,-1,-1`],
        cubeDict[`-1,1,0`]=cubeDict[`-1,0,-1`],
        cubeDict[`-1,1,1`]= cubeDict[`-1,1,-1`]
      }
        break;
        // =======type:x???pos???0???dir: 1??????=======
       case '0':
        {
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,0,0`],
          cubeDict[`-1,0,1`],
  
          cubeDict[`0,0,-1`],
          cubeDict[`0,0,0`],
          cubeDict[`0,0,1`],
  
          cubeDict[`1,0,-1`],
          cubeDict[`1,0,0`],
          cubeDict[`1,0,1`]
        
      }
      break;
      // =======type:x???pos???1???dir: 1??????=======
       case '1':
         {
          cubeDict[`-1,-1,-1`],
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,1,-1`],
  
          cubeDict[`0,-1,-1`],
          cubeDict[`0,0,-1`],
          cubeDict[`0,1,-1`],
  
          cubeDict[`1,-1,-1`],
          cubeDict[`1,0,-1`],
          cubeDict[`1,1,-1`]
        }
        break;
  
       default:
         {
          console.log('wrong number');
  
         }
         break;
     }
   }else if(type==='y'){
    switch(pos){
      // =======type:y???pos???1???dir: 1??????=======
      case '-1': 
      {    
        cubeDict[`-1,-1,-1`]=cubeDict[`-1,-1,1`],
        cubeDict[`-1,-1,0`]=cubeDict[`-1,0,1`],
        cubeDict[`-1,-1,1`]=cubeDict[`-1,1,1`],
  
        cubeDict[`-1,0,-1`]= cubeDict[`-1,-1,0`],
        cubeDict[`-1,0,0`]= cubeDict[`-1,0,0`],
        cubeDict[`-1,0,1`]= cubeDict[`-1,1,0`],
  
        cubeDict[`-1,1,-1`]=cubeDict[`-1,-1,-1`],
        cubeDict[`-1,1,0`]=cubeDict[`-1,0,-1`],
        cubeDict[`-1,1,1`]= cubeDict[`-1,1,-1`]
      }
        break;
      // =======type:y???pos???0???dir: 1??????=======
       case '0':
        {
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,0,0`],
          cubeDict[`-1,0,1`],
  
          cubeDict[`0,0,-1`],
          cubeDict[`0,0,0`],
          cubeDict[`0,0,1`],
  
          cubeDict[`1,0,-1`],
          cubeDict[`1,0,0`],
          cubeDict[`1,0,1`]
        
      }
      break;
      // =======type:y???pos???1???dir: 1??????=======
       case '1':
         {
          cubeDict[`-1,-1,-1`],
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,1,-1`],
  
          cubeDict[`0,-1,-1`],
          cubeDict[`0,0,-1`],
          cubeDict[`0,1,-1`],
  
          cubeDict[`1,-1,-1`],
          cubeDict[`1,0,-1`],
          cubeDict[`1,1,-1`]
        }
        break;
  
       default:
         {
          console.log('wrong number');
  
         }
         break;
     }
  }else if(type==='z'){
    switch(pos){
      // =======type:z???pos???-1???dir: 1??????=======
      case '-1': 
      {    
        cubeDict[`-1,-1,-1`]=cubeDict[`-1,-1,1`],
        cubeDict[`-1,-1,0`]=cubeDict[`-1,0,1`],
        cubeDict[`-1,-1,1`]=cubeDict[`-1,1,1`],
  
        cubeDict[`-1,0,-1`]= cubeDict[`-1,-1,0`],
        cubeDict[`-1,0,0`]= cubeDict[`-1,0,0`],
        cubeDict[`-1,0,1`]= cubeDict[`-1,1,0`],
  
        cubeDict[`-1,1,-1`]=cubeDict[`-1,-1,-1`],
        cubeDict[`-1,1,0`]=cubeDict[`-1,0,-1`],
        cubeDict[`-1,1,1`]= cubeDict[`-1,1,-1`]
      }
        break;
        // =======type:z???pos???0???dir: 1??????=======
       case '0':
        {
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,0,0`],
          cubeDict[`-1,0,1`],
  
          cubeDict[`0,0,-1`],
          cubeDict[`0,0,0`],
          cubeDict[`0,0,1`],
  
          cubeDict[`1,0,-1`],
          cubeDict[`1,0,0`],
          cubeDict[`1,0,1`]
        
      }
      break;
      // =======type:z???pos???1???dir: 1??????=======
       case '1':
         {
          cubeDict[`-1,-1,-1`],
          cubeDict[`-1,0,-1`],
          cubeDict[`-1,1,-1`],
  
          cubeDict[`0,-1,-1`],
          cubeDict[`0,0,-1`],
          cubeDict[`0,1,-1`],
  
          cubeDict[`1,-1,-1`],
          cubeDict[`1,0,-1`],
          cubeDict[`1,1,-1`]
        }
        break;
  
       default:
         {
          console.log('wrong number');
  
         }
         break;
     }
  }else{
    console.log('wrong character');
  }

}}

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

//??????x??????0????????????????????????cube???????????????
async function runAnimation(){
  await rotateBoxes(getBoxes('x',-1),{
    rotationX:90,
  });
  resetBoxes('x','-1','-1');
  
  await rotateBoxes(getBoxes('x', 0), {
    rotationX: 90,
  });
  resetBoxes('x','-1','-1');
  await rotateBoxes(getBoxes('y', -1), {
    rotationY: 90,
  });



}
// async function runAnimation() {
//   for(let i = -1;i <= 1; i ++) {
//     await rotateBoxes(getBoxes('x', i), {//get all cubes that  Xaxis is i
//      rotationX: 90,
//     });

//     await rotateBoxes(getBoxes('x', i), {
//      rotationX: 0,
//     });//rotationX have to return 0

//     await rotateBoxes(getBoxes('y', i), {
//      rotationY: 90,
//     });

//     await rotateBoxes(getBoxes('y', i), {
//      rotationY: 0,
//     });

//     await rotateBoxes(getBoxes('z', i), {
//      rotationZ: 90,
//     });

//     await rotateBoxes(getBoxes('z', i), {
//      rotationZ: 0,
//     });
//   }
  
//   runAnimation();
// }

runAnimation();