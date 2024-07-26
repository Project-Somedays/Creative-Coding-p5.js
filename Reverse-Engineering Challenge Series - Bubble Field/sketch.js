let gui;
let params;

function setup() {
  // createCanvas(min(windowWidth,windowHeight), min(windowWidth,windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);

  
  normalMaterial();
  
  gui = new lil.GUI();
  
  params = {
    n: 10,
    sep : windowWidth/15,
    noiseZoom: 0.1,
    noiseProgRate: 100,
    globRotRate: 600,
    autoRotMode: true
  }

  gui.add(params, 'n', 3, 20, 1);
  gui.add(params, 'sep', windowWidth/50, windowWidth/5);
  gui.add(params, 'noiseZoom', 0.01, 300);
  gui.add(params, 'noiseProgRate', 30, 600);
  gui.add(params, 'globRotRate', 30, 1200);
  gui.add(params, 'autoRotMode');
}

function draw() {
  background(0);
  push();
  if(params.autoRotMode) {
    rotateX(frameCount/params.globRotRate);
    rotateY(frameCount/params.globRotRate);
    rotateZ(frameCount/params.globRotRate);
  }
  for(let x = -params.n/2; x < params.n/2; x ++){
    for(let y = -params.n/2; y < params.n/2; y ++){
      for(let z = -params.n/2; z < params.n/2; z ++){
        push();
        translate(x*params.sep, y*params.sep, z*params.sep);
        let r = map(noise(x/params.noiseZoom,y/params.noiseZoom + frameCount/params.noiseProgRate,z/params.noiseZoom + frameCount/params.noiseProgRate), 0, 1, params.sep/100, params.sep/2);
        sphere(r);
        pop();
      }
    }
  }
  pop();

  orbitControl();
}
