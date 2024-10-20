// https://x.com/pickover/status/1843668475690267063


let gui, params;
let p;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);

  gui = new lil.GUI();
  params = {
    k0: 0.001,
    k1: 0.001,
    k2: 0.001,
    x: 1,
    y: 1,
    z: 1,
    n : 500
  }

  gui.add(params, 'k0', 0, 0.1);
  gui.add(params, 'k1', 0, 0.1);
  gui.add(params, 'k2', 0, 0.1);
  gui.add(params, 'x', 0, 10);
  gui.add(params, 'y', 0, 10);
  gui.add(params, 'z', 0, 10);
  gui.add(params, 'n', 100, 5000, 1);
 
  p = createVector(1,1,1);
  fill(255);
  // stroke(255);
  // strokeWeight(10);
  noStroke();
  
}

function draw() {
  background(0);
  p = createVector(params.x, params.y, params.z);

  // beginShape();
  for(let i = 0; i < params.n; i++){
    // vertex(p.x, p.y, p.z);
    push();
    translate(p.x, p.y, p.z);
    sphere(100);
    pop();
    p = dequan(p);
  }
  // endShape();

  orbitControl();
}


function dequan(p){
  let dx = params.k0 * p.x - p.y * p.z;
  let dy = params.k1 * p.y + p.x * p.z;
  let dz = params.k2 * p.z + p.x * p.y / 3.0;

  return createVector(p.x + dx, p.y + dy, p.z + dz);
}
