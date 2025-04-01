/*
| Author          | Project Somedays                      
| Title           | Reverse-Engineering Challenges: Rotten Towers 
| 📅 Started      | 2025-03-31        
| 📅 Completed    | 2025-04-01        
| 🕒 Taken        | 1.5hrs                                  
| 🤯 Concept      | 3D OpenSimplex Noise, but probs needs a shader
| 🔎 Focus        | ThreeJS performance boost from p5js

Reverse-Engineering this sketch: https://x.com/junkiyoshi/status/1905589524417351764

I've tried this voxel kind of art before. Love it! Hitting limits of ThreeJS this many boxes though...
Basically, I'm looping over all the cubes and seeing if their 3D opensimplexnoise value is below some threshold.

Using lil-gui to speed up my iteration time

## Resources:
- Sliders: lil-gui

## Stretch Goals/Extension Ideas
- [ ] Implement as a shader
- [ ] Learn ThreeJS shaders

## TODO:
 - [x] Make a column of a bunch boxes
 - [x] Set box visibility based on noise value over time
 - [x] Lil-GUI controls
 - [x] Refinement 

## Things I've learned
- Open Simple Noise returns values between -1 and 1 🤯 
Haha was scratching my head for a very long time trying to work out why I wasn't filtering out more blocks. Too used to Perlin noise.

*/



let scene, camera, renderer, controls;
let keyLight, fillLight, backLight;
let modelManager;
let gui, params;
let blocks;

let openSimplexNoise;
let t = 0;



function setup() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0000);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  // camera = new THREE.PerspectiveCamera( 75, 1080/1920, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setSize(1080, 1920);
  document.body.appendChild( renderer.domElement );

  openSimplexNoise = new OpenSimplexNoise(new Date());
	
  // sliders
	params = {
		noiseZoom: 1.0,
    threshold: 0.3,
    tRate: 0.05,
    rotYRate: 0.01
	}
	
	gui = new lil.GUI();
  gui.add(params, 'noiseZoom', 0.01, 2.0, 0.005);
  gui.add(params, 'threshold', 0.0, 1.0, 0.005);
  gui.add(params, 'tRate', 0.001, 0.1, 0.001);
  gui.add(params, 'rotYRate', 0.001, 0.1, 0.001);


  // OrbitControls
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 500;
  camera.position.z = 5;


  // 3-Point Lighting
  keyLight = new THREE.DirectionalLight( 0xffffff, 1.0 ); // Key light (main light)
  keyLight.position.set( 1, 1, 1 );
  scene.add( keyLight );

  fillLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); // Fill light (softens shadows)
  fillLight.position.set( -1, 0, 1 );
  scene.add( fillLight );

  backLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); // Back light (separates object from background)
  backLight.position.set( 0, -1, -1 );
  scene.add( backLight );

blocks = new THREE.Group();
  // add test big
  for(let x = -1; x <= 1; x += 0.1){
    for(let z = -1; z <= 1; z += 0.1){
      for(let y = -5; y <= 5; y += 0.1){
        let col = getColorAtValue(Math.abs(Math.sqrt(x**2 + z**2)));
        let mesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.1, 0.1),
          new THREE.MeshStandardMaterial({color: col})
        );
        mesh.position.set(x,y,z);
        blocks.add(mesh);
      }
    }
  }

  scene.add(blocks);
  

}


function getColorAtValue(value) {
  // Ensure value is within range [0, 1]
  value = abs(value);
  const clampedValue = Math.max(0, Math.min(1, value));
  
  // Define our color points
  
  const brown = new THREE.Color('#1c120b');
  const red = new THREE.Color('#FF0000');
  const yellow = new THREE.Color('#FFFF00');
  
  // Create a result color
  const resultColor = new THREE.Color();
  
  // Handle the two different ranges
 if (clampedValue >= 0.3) {
    // Between brown (1.0) and red (0.3)
    // Normalize the value to [0, 1] for this range
    const normalizedValue = (clampedValue - 0.3) / 0.7;
    resultColor.lerpColors(red, brown, normalizedValue, resultColor);
  } else {
    // Between red (0.3) and yellow (0.0)
    // Normalize the value to [0, 1] for this range
    const normalizedValue = clampedValue / 0.3;
    resultColor.lerpColors(yellow, red, normalizedValue, resultColor);
  }
  
  return resultColor;
}


const mapNoiseVal = (offset, tMult, minVal, maxVal) => map(openSimplexNoise.noise2D(offset, t*tMult), 0, 1, minVal, maxVal); 

// Animation loop
function animate() {
  requestAnimationFrame( animate );
  if(params) t += params.tRate;
  if(controls) controls.update();
  if(renderer) renderer.render( scene, camera );

  if(blocks){
    blocks.rotation.y += params.rotYRate;
    blocks.children.forEach(child => {
      child.visible = 0.5*(openSimplexNoise.noise3D(
        child.position.x * params.noiseZoom - t, 
        child.position.y * params.noiseZoom, 
        child.position.z * params.noiseZoom + t
        )+1) < params.threshold;
    })
  }
  
  
  
}

animate();

// Handle window resizing
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize, false );

