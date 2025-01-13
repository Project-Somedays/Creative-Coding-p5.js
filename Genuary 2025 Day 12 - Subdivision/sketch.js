let w;

let cam;
let gui, params;
let colourPalettes = {
  "Carrot_Rose": '#ff0f7b, #f89b29'.split(","),
  "YaleBlue_LemonChiffon": '#0d3b66, #faf0ca'.split(","),
  "IndigoDye_PersianRed": '#08415c, #cc2936'.split(","),
  "MedSlateBlue_Mauve": '#696eff, #f8acff'.split(","),
  "IndigoDye_TiffanyBlue": '#145277, #83d0cb'.split(","),
  "Jonquil_Viridian": '#f8c828, #007e5d'.split(","),
  "PersianGreen_BurntSienna": '#2a9d8f, #e76f51'.split(","),
  "Jonquil_Indigo": "#ffcc00, #4b116f".split(", ")
}


function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);

 


  ortho();
  // noStroke();
  cam = createCamera();
  cam.setPosition(0.8*width, -1*width, 0.8*width);
  cam.lookAt(0,0,0);
  pixelDensity(1);

  gui = new lil.GUI();
  params = {
    n: 30,
    omega : 3,
    protrusionExtent: 0.5,
    baseExtrusion: 0.5,
    colourPalette: colourPalettes.Carrot_Rose,
    noiseProgRate: 0.01,
    rotationFrames: 600
  }

  w = width/params.n;

  gui.add(params, 'n', 10, 45, 1).onChange(val => w = width/val);
  gui.add(params, 'omega', 1, 6);
  gui.add(params, 'protrusionExtent', 0, 1);
  gui.add(params, 'baseExtrusion', 0, 1);
  gui.add(params, 'noiseProgRate', 0.001, 0.03,0.00);
  gui.add(params, 'rotationFrames', 30, 1200, 10);
  gui.add(params, 'colourPalette', colourPalettes)


  

}

function draw() {
  background(0);
  let globalRotation = frameCount * TWO_PI/params.rotationFrames;

  // lights
  directionalLight(255, 255, 255, p5.Vector.sub(createVector(0,0,0), createVector(width*cos(globalRotation), 0, width*sin(globalRotation))));
  directionalLight(255, 255, 255, p5.Vector.sub(createVector(0,0,0), createVector(width*cos(globalRotation+TWO_PI/3), width*sin(globalRotation+TWO_PI/3), 0)));
  directionalLight(255, 255, 255, p5.Vector.sub(createVector(0,0,0), createVector(0,width*cos(globalRotation+2*TWO_PI/3), width*sin(globalRotation+2*TWO_PI/3))));

  rotateY(globalRotation/2);
  let triggerX = map(noise(frameCount * params.noiseProgRate), 0, 1, -width/2, width/2);
  let triggerZ = map(noise(frameCount * params.noiseProgRate + 1000), 0, 1, -width/2, width/2);
  
  for(let i = 0; i < params.n; i++){
    for(let j = 0; j < params.n; j++){
      let x = -w*params.n/2 + i*w;
      let z = -w*params.n/2 + j*w;
      let d = dist(triggerX, triggerZ, x, z);
      let amt = map(d, 0, width*sqrt(2), 0, 1);
      let h = params.protrusionExtent*width*sin(params.omega*amt*TWO_PI) + 1.5*width*params.baseExtrusion
      let col = lerpColor(color(params.colourPalette[0]), color(params.colourPalette[1]), amt);
      fill(col);
      for(let k = 0; k < 3; k++){
        switch(k){
          case 0:
            push();
            translate(x, 0, z);
            box(w, h, w);
            pop();
            break;
          case 1:
            push();
            rotateX(HALF_PI);
            translate(x, 0, z);
            box(w, h, w);
            pop();
            
            break;
          case 2:
            push();
            rotateZ(HALF_PI);
            rotateY(HALF_PI);
            translate(x, 0, z);
            box(w, h, w);
            pop();
            break;
        }
        
      }
    }
  }

  orbitControl();
}
