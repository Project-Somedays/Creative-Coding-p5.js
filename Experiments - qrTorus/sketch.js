let n = 250;
let p = 8.0; 
let q = 9.0;
let gui, params;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  params = {
    p : 8.0,
    q: 9.0,
    n: 250,
    scl: 10
  }
  
  
}

function draw() {
  background(220);
  

  normalMaterial();
  for(let t = 0; t < n; t++){
    let pt = pqtorus(t*TWO_PI/n + frameCount/10000, p, q, width/10);
    push();
    translate(pt.x, pt.y, pt.z);
    sphere(width/100);
    pop();
  }

  orbitControl();
}


function pqtorus(t, p, q, scl){
  let r = cos(q*t)+2;
  let x = 0.5*r*cos(p*t);
  let y = 0.5*r*sin(p*t);
  let z = - 0.5*sin(q*t);
  return createVector(x, y, z).mult(scl);
}