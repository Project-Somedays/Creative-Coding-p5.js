let scene, camera, renderer;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(5,5,5);

  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(width, height);
  document.body.appendChild( renderer.domElement );


  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshToonMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);




}

function draw() {
  background(0);

  renderer.render(scene, camera);
}
