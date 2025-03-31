let scene, camera, renderer, controls;
let keyLight, fillLight, backLight;
let modelManager;
let gui, params;

// let test;
let testnest;
let testnests = [];
let openSimplexNoise;
let t = 0;



function setup() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0000);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );

  openSimplexNoise = new OpenSimplexNoise(new Date());
	
	params = {
		explodeMode: true,
		rotateMode: true
	}
	
	gui = new lil.GUI();
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


  // add test big
  for(let i = 0; i < 100; i ++){
    testnests.push(new Disc(3, i*Math.PI * 2.0/10.0, i*0.5));
  }
  

}

class Disc{
  constructor(r, theta, z){
    this.r = r;
    this.rNoiseOffset = Math.random()*10000.0;
    this.aNoiseOffset = Math.random()*10000.0;
    this.theta = theta;
    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.p = new THREE.Vector3(0,0,-z);
    this.body = new THREE.Group();
    for(let i = 0; i < 10; i++){
      let col = i >= 8 ? new THREE.Color(0x000000) : new THREE.Color(0xffffff);
      this.body.add(new THREE.Mesh(
        new THREE.TorusGeometry(1 - 0.1*i,0.075,16,100),
        new THREE.MeshStandardMaterial({color: col})
      ));
    }
    scene.add(this.body);
  }
  update(){
    this.theta = mapNoiseVal(this.aNoiseOffset, 0.1, 0.0, TWO_PI);
    this.r = mapNoiseVal(this.rNoiseOffset, 1.0, 3.0, 4.0);
    this.p.x = this.r * Math.cos(this.theta);
    this.p.y = this.r * Math.sin(this.theta);
    this.body.position.copy(this.p);
  }
}

const mapNoiseVal = (offset, tMult, minVal, maxVal) => map(openSimplexNoise.noise2D(offset, t*tMult), 0, 1, minVal, maxVal); 

// Animation loop
function animate() {
  requestAnimationFrame( animate );
  t += 0.005;
  if(controls) controls.update();
  if(renderer) renderer.render( scene, camera );

  if(testnests){
    for(let testnest of testnests){
      testnest.update();
    }
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

