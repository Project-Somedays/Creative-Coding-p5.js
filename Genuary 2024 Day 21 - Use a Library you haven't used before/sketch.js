/*
Author: Project Somedays
Date started: 2024-07-01
Last updated: 2024-07-06
Title: Genuary 2024 Day 21 - Use a library you haven't used before

There's something mesmerising about complex 3D gemetry that morphs over time
This is cubes rotating around a ring on an offset
Tickles my math brain very pleasingly

Experiment!

INSPIRATION/RESOURCES
  - Mobius Wind Kinentic Sculpture: https://x.com/Rainmaker1973/status/1806656289965019587
  - THREE.js: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
  - THREE.js OrbitControls https://unpkg.com/three@0.122.0/examples/js/controls/OrbitControls.js
  - lil-gui: https://cdn.jsdelivr.net/npm/lil-gui@0.19.2/dist/lil-gui.umd.min.js
  - Simplex noise: https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js
  - Thing Hand Model: https://www.printables.com/model/7804-addams-family-thing/files

TODO/Opportunities:
  DONE: Make adjustable with lil-gui
  DONE Set variables with Simplex noise
  TODO: Tidy up 
  TODO: Use propellers
  TODO: Set up scene
  TODO: Experiment with different materials
  TODO: Experiment with lighting
*/


//######### VARIABLES ##########//
let renderer, scene, camera, cube, ambientLight, ptLight;
let gui = new lil.GUI();


/*########### Toggle Cursor ###############*/
let cursorVisible = true;
function toggleCursor(event) {
  if (event.key === 'c') {
    cursorVisible = !cursorVisible;
    document.getElementById('threejs-canvas').style.cursor = cursorVisible ? 'default' : 'none';
  }
}

document.addEventListener('keydown', toggleCursor);


const params = {
  cameraRotationRate: 3,
  cameraZoom: 5,
  cameraHeight: 0,
  bladeAngleZ : 0,
  bladeAngleY: 0,
  rotationRate: 8,
  bladeSclX : 1,
  bladeSclY : 1,
  bladeSclZ : 1,
  windStrength: 5,
  // coneRadius: 1,
  // coneHeight: 3,
  noiseProgRate: 8,
  autoRotateMode: true,
  driveX: false,
  driveY: false,
  driveZ: false,
  driveRotation:false,
  driveRotationRate: false,
  driveBladeRotationZ : false
}

/* ######## HELPER FUNCTIONS ############# */
const mapVal = (value, start1, stop1, start2, stop2) => {start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))};

/*########### GUI BIZ ############ */
gui.add(params, 'cameraRotationRate', 0.01, 6);
gui.add(params, 'cameraZoom', 0,10,0.1);
gui.add(params, 'cameraHeight', 0,10,0.1);
gui.add(params, 'bladeAngleZ',0,2*Math.PI,0.5/Math.PI);
gui.add(params, 'bladeAngleY',0,2*Math.PI,0.5/Math.PI);
gui.add(params, 'rotationRate', 0, 20);
gui.add(params, 'bladeSclX',0.05,5);
gui.add(params, 'bladeSclY',0.05,5);
gui.add(params, 'bladeSclZ',0.05,5);
// gui.add(params, 'coneRadius',0.1,2);
// gui.add(params, 'coneHeight',0.1,5);
gui.add(params, 'noiseProgRate',1,20);
gui.add(params, 'autoRotateMode');
gui.add(params, 'driveX');
gui.add(params, 'driveY');
gui.add(params, 'driveZ');
gui.add(params, 'driveRotation');
gui.add(params, 'driveBladeRotationZ');


/*########### Noise ############*/

const noise = new SimplexNoise();
const windSeed = Math.random()*10000;
const mapNoise = (t, minVal, maxVal) => {mapVal(noise.noise2D(windSeed,t),0,1,minVal,maxVal)};

//######### RENDERER ##########//
renderer = new THREE.WebGLRenderer();
// renderer.setSize(1080, 1080);
renderer.setSize( window.innerWidth, window.innerHeight );
let aspectRatio = window.innerWidth / window.innerHeight; // 1
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );


//######### Scene ##########//
scene = new THREE.Scene();

//######### LIGHTS ##########//
// Not needed for NormalMaterial
// Add Lights
ambientLight = new THREE.AmbientLight( 0x404040, 0.8); // soft white light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.8);
scene.add(pointLight);

// ########### THING ############# //
function createGLTF(scene) {
	const gltfLoader = new THREE.GLTFLoader();
	const url = 'hand.gltf';
	gltfLoader.load(url, (gltf) => {
		handModel = gltf.scene;
		handModel.position.y = -12.5;
    handModel.scale.set(0.2, 0.2, 0.2);
		scene.add(handModel);
  
	}, handleProgress, handleError);
	
	function handleProgress() {};
	
	function handleError(error) {
		console.error(error);
	}

}

createGLTF(scene);



//######### CAMERA ##########//
camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.set(0,0,5);
camera.lookAt(new THREE.Vector3(0,0,0));

const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.

//######### 3D OBJECT BIZ ##########//
// Create figure-8 shape


let radius = 1.5;

const bladeGeometry =  new THREE.BoxGeometry(1,1,1);
// const bladeGeometry = new THREE.ConeGeometry(params.coneRadius,params.coneHeight,32);
// bladeMaterial = new THREE.MeshPhongMaterial();
bladeMaterial = new THREE.MeshPhongMaterial({
  color : new THREE.Color(0xff0000)
});
// var mirrorMaterial = new THREE.MeshPhongMaterial( { emissive: 0x111111, envMap: mirrorCamera.renderTarget } );

// bladeMaterial = new THREE.MeshPhysicalMaterial({
//   roughness: 0,
//   metalness: 1
// })

ringGeometry = new THREE.TorusGeometry(radius, radius/10,12,48, 2*Math.PI);
const ring = new THREE.Mesh(ringGeometry, bladeMaterial);
scene.add(ring);

let blades = [];
let nCubes = 36;
for(let i = 0; i < nCubes; i++){
  let group = new THREE.Group();
  let blade = new THREE.Mesh(bladeGeometry,bladeMaterial); 
  blade.position.set(0,radius,0);
  group.add(blade);
  group.rotateZ(i*2*Math.PI/nCubes);
  blades.push(group);
}

blades.map(e => scene.add(e));





// ############# INTERACTION ############## //
document.addEventListener('keydown', (event) => {
  // Check if the 'a' key was pressed
  switch(event.key.toLowerCase()){
    case 'a':
      autoRotateMode = !autoRotateMode;
      break;
    
    default:
      break;
  }
});

//######### Animation ##########//

const clock = new THREE.Clock();

function animate() {
	const elapsedTime = clock.getElapsedTime();
  let rotationRate = params.driveRotationRate ? noise.noise2D(elapsedTime/params.noiseProgRate, 0) * 20 : params.rotationRate;
	// let rotateRate = 0.5*(Math.cos(elapsedTime) + 1) + 2*Math.PI/100; // work in progress
  for(let i = 0; i < blades.length; i++){
    blades[i].children[0].rotation.z = params.driveBladeRotationZ ? noise.noise2D(elapsedTime/params.noiseProgRate,0)*2*Math.PI : params.bladeAngleZ; //(elapsedTime/5 + i/nCubes)*2*Math.PI - 0.5*Math.PI;
    
    // blades[i].children[0].rotation.x = (elapsedTime/params.rotationRate + 2*i/nCubes)*Math.PI;
    // blades[i].children[0].rotation.x = (elapsedTime/mapNoise(elapsedTime,0.1,10) + 2*i/nCubes)*Math.PI;
    blades[i].children[0].rotation.x = params.driveRotation ? (noise.noise2D(elapsedTime/params.noiseProgRate, 1000)*0.5 + 0.5*i/nCubes)*Math.PI : (0.1*elapsedTime/rotationRate + 0.5*i/nCubes)*Math.PI;
    blades[i].children[0].scale.x = params.driveX ? noise.noise2D(elapsedTime/params.noiseProgRate, 2000) * 2 * params.bladeSclX : params.bladeSclX;
    blades[i].children[0].scale.y = params.driveY ? noise.noise2D(elapsedTime/params.noiseProgRate, 3000) * 2 * params.bladeSclY : params.bladeSclY;
    blades[i].children[0].scale.z = params.driveZ ? (noise.noise2D(elapsedTime/params.noiseProgRate, 4000) + 0.5) * 2 * params.bladeSclZ : params.bladeSclZ;
  }

  if(params.autoRotateMode){
    let a = elapsedTime/params.cameraRotationRate;
    camera.position.set(params.cameraZoom*Math.cos(a), params.cameraHeight, params.cameraZoom*Math.sin(a));
    pointLight.position.set(params.cameraZoom*Math.cos(a), params.cameraHeight, params.cameraZoom*Math.sin(a));
    camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
  } else{
    controls.update();
  }
  
	
	
	renderer.render( scene, camera );
}
