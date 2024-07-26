// Confusion... why is this wrapping around?

let gui;
let params;
let xOff, yOff, zOff;
let cntrlPt;

function setup() {
  // createCanvas(min(windowWidth,windowHeight), min(windowWidth,windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);

  
  normalMaterial();
  
  gui = new lil.GUI();
  xOff = random(10000);
  yOff = random(10000);
  zOff = random(10000);
  
  cntrlPt = createVector(0,0,0);
  
  params = {
    n: 10,
    sep : windowWidth/15,
    noiseZoom: 0.1,
    noiseProgRate: 100,
    globRotRate: 600,
    autoRotMode: true,
    upperDistLim: height/4
  }

  gui.add(params, 'n', 3, 20, 1);
  gui.add(params, 'sep', windowWidth/50, windowWidth/5);
  gui.add(params, 'noiseZoom', 0.01, 300);
  gui.add(params, 'noiseProgRate', 30, 600);
  gui.add(params, 'globRotRate', 30, 1200);
  gui.add(params, 'upperDistLim', 0.01*params.n*params.sep,params.n*params.sep);
  gui.add(params, 'autoRotMode');
  }

function draw() {
  background(0);
  push();

  noFill();
  stroke(255);
  
 
  let x = map(noise(frameCount/params.noiseProgRate + xOff), 0, 1, -params.sep*params.n/2, params.sep*params.n/2);
  let y = map(noise(frameCount/params.noiseProgRate + yOff), 0, 1, -params.sep*params.n/2, params.sep*params.n/2);
  let z = map(noise(frameCount/params.noiseProgRate + zOff), 0, 1, -params.sep*params.n/2, params.sep*params.n/2);
  cntrlPt.set(x,y,z);
  // translate(x,y,z);
  // sphere(width/50);

  // if(params.autoRotMode) {
  //   rotateX(frameCount/params.globRotRate);
  //   rotateY(frameCount/params.globRotRate);
  //   rotateZ(frameCount/params.globRotRate);
  // }
  noFill();
  push();
  translate(cntrlPt.x, cntrlPt.y, cntrlPt.z);
  sphere(params.sep/4);
  pop();

  normalMaterial();
  strokeWeight(5);
  for(let x = -params.n/2; x < params.n/2; x ++){
    for(let y = -params.n/2; y < params.n/2; y ++){
      for(let z = -params.n/2; z < params.n/2; z ++){
       
        
        let d = dist(cntrlPt.x, cntrlPt.y, cntrlPt.z, x*params.sep, y*params.sep, z*params.sep);
        let r = map(d, 0, 0.5*sqrt(2)*params.n*params.sep, 0.5*params.sep, 0.001*params.sep);
        
        line(cntrlPt.x, cntrlPt.y, cntrlPt.z, x*params.sep, y*params.sep, z*params.sep);
        // let r = map(d, 0, params.upperDistLim, height/100, height/500);
        push();
        translate(x*params.sep,y*params.sep,z*params.sep);
        sphere(r);
        pop();
      }
    }
  }


  orbitControl();
}
