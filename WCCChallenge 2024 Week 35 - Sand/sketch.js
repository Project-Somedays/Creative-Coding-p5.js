let worms = [];
let nWorms = 1;
let wormTarget;
let xOff = Math.random(1000);
let yOff = Math.random(1000);
let gui, params;
let noiseDetail = 1/300;

let dunescape;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  fill("#C2B280");

  gui = new lil.GUI();
  
  params = {
    sandColour : color("#C2B280"),
    showStroke: true,
    showSand: false,
    showWorms: true,
  }

  gui.addColor(params, 'sandColour');
  gui.add(params, 'showStroke');
  gui.add(params, 'showSand');
  gui.add(params, 'showWorms');

  
  
  for(let i = 0; i < nWorms; i++){
    worms.push(new Worm(20, width/50, color(255), width/50, width/25));
  }

  wormTarget = createVector(0,0,0);

  dunescape = new Dunescape(width/50, 1/300, 0, width/5);
  

}

const getNoiseVal = (offset, min, max) => {return map(noise(frameCount*0.01 + offset), 0, 1, min, max)}; 

function draw() {
  background(0);
  
  stroke(255);
  let x = getNoiseVal(xOff, -width/2, width/2);
  let y = getNoiseVal(yOff, -width/2, width/2);
  let z = 0; // map(noise(x*noiseDetail, y*noiseDetail), 0, 1, 0, width/5);
  // lookup the nearest terrain val so it's max at the surface

  if(params.showWorm){
    fill(255);
    wormTarget.set(x, y, z) ;
    for(let worm of worms){
      worm.update(wormTarget.x,wormTarget.y);
      worm.show();
    }
  }


  // directionalLight(255, 255, 255, -1, -1, -0.25);
  // pointLight(255, 255, 255, 0, 0, height);
  
  fill("#C2B280")
  stroke(0);
  if(params.showSand) dunescape.show();
  
  
  orbitControl();
  
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
