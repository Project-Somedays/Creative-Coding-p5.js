let gui, params;

// let palette = "#f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0".split(", ");


let palette = "#10002b, #240046, #3c096c, #5a189a, #7b2cbf, #9d4edd, #c77dff, #e0aaff".split(", ")

function setup() {
  // createCanvas(600, 600, WEBGL);
  createCanvas(1080, 1080, WEBGL);
  noStroke();
  frameRate(60);

  gui = new lil.GUI();

  params = {
    scl : 75,
    sphereCount : 100,
    cycleFrames : 300,
    noiseZoom : 100,
    rotationFrames: 60,
    sphereMinR: 10,
    sphereMaxR: 50 
  }

  gui.add(params, 'scl', 1, 500);
  gui.add(params, 'sphereCount', 50, 1000, 1);
  gui.add(params, 'cycleFrames', 60, 1200, 1);
  gui.add(params, 'rotationFrames', 60, 1200, 1);
  gui.add(params, 'noiseZoom', 1, 200);
  gui.add(params, 'sphereMinR', 1, 100, 1);
  gui.add(params, 'sphereMaxR', 1, 200, 1);

}

function draw() {
  background(0);
  
  pointLight(255, 255, 255, 0,0,0);
  directionalLight(255, 255, 255, 0.5, 0.5, 0);
  directionalLight(255, 255, 255, -0.5, 0.5, 0);
  directionalLight(255, 255, 255, 0.5, -0.5, 0);
  directionalLight(255, 255, 255, -0.5, -0.5, 0);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  push();
  rotateY(6 * frameCount / params.cycleFrames);
  
  for(let i = 0; i < params.sphereCount; i++){
    let t =  i * TWO_PI / params.sphereCount;
    if(
      (t > PI/6 && t < PI/3) ||
      (t > HALF_PI + PI/6 && t < HALF_PI + PI/3) ||
      (t > PI + PI/6 && t < PI + PI/3) ||
      (t > 3*HALF_PI + PI/6 && t < 3*HALF_PI + PI/3)
    ) continue;
    let offset = frameCount * TWO_PI/params.cycleFrames;
    let p = trefoil(t + offset).mult(params.scl);
    let r = map(noise(p.x/params.noiseZoom, p.y/params.noiseZoom, p.z/params.noiseZoom), 0, 1, params.sphereMinR, params.sphereMaxR);
    fill(palette[i%palette.length]);
    push();
    translate(p.x, p.y, p.z);
    sphere(r);
    pop();
  }
  
  pop();
  
  orbitControl();

  // if(frameCount > 10 + params.cycleFrames) noLoop();
}




function trefoil(t){
        let x = sin(t) + 2*sin(2*t);
        let y = cos(t) - 2*cos(2*t);
        let z = -sin(3*t);
        return createVector(x,y,z);
    }