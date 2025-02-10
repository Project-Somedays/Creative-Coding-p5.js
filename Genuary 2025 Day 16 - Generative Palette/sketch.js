let raver;
let n = 50;
let w;
let ravers = [];
let noiseProgRate = 0.0025;
let greenCntrl, redCntrl, blueCntrl;
let controls;
let blueBizModel, greenBizModel, redBizModel;
let blueBizTexture, greenBizTexture, redBizTexture;


function preload(){
  raver = loadModel("Raver.obj", true);
  redBizModel = loadModel("RedBiz.obj", true);
  redBizTexture = loadImage("redBizTexture.png");
  greenBizModel = loadModel("GreenBiz.obj", true);
  greenBizTexture = loadImage("greenBizTexture.png");
  blueBizModel = loadModel("BlueBiz.obj", true);
  blueBizTexture = loadImage("blueBizTexture.png");
}

function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);
  noCursor();
  w = 3*width;
  noStroke();

  greenCntrl = new Cntrl(greenBizModel, greenBizTexture);
  blueCntrl = new Cntrl(blueBizModel, blueBizTexture);
  redCntrl = new Cntrl(redBizModel, redBizTexture);
  controls = [redCntrl, greenCntrl, blueCntrl];

  for(let i = 0; i < n; i++){
    for(let j = 0; j < n; j++){
      let x = -w/2 + i * w/n;
      let z = -w/2 + j * w/n;
      let offset = random(TWO_PI);
      let p = createVector(x,height/4,z);
      let yRot = random(TWO_PI);
      ravers.push({p, offset, yRot});
  }
}
  
}

function draw() {
  background(0);
  rotateY(frameCount*TWO_PI/1200);
  pointLight(255, 255, 255, 0,-height/2, 0);
  directionalLight(255, 255, 255, 0,1,0);
  
  for(let c of controls){
    c.update()
    c.show();
  }

  
  for(let r of ravers){
    push();
    let y = r.p.y - height/20  * abs(sin(frameCount * TWO_PI/120 + r.offset));
    translate(r.p.x, y, r.p.z);
    rotateY(r.yRot);
    let col = getCol(r.p, redCntrl.p, greenCntrl.p, blueCntrl.p);
    // emissiveMaterial(col[0], col[1], col[2]);
    fill(col);
    // console.log(col);
    model(raver);
    pop();
  }
  orbitControl();

}

class Cntrl{
  constructor(mdl, txture){
    this.xOffset = random(10000);
    this.zOffset = random(10000);
    this.p = createVector(0,0,0);
    this.mdl = mdl;
    this.txture = txture;
    this.rotYDir = random([1, -1]);
    this.rotXDir = random([1, -1]);
    this.rotZDir = random([1, -1]);
    this.rotYOffset = random(TWO_PI);
    this.rotXOffset = random(TWO_PI);
    this.rotZOffset = random(TWO_PI);
  }

  update(){
    this.p.x = mapNoise(this.xOffset, -w*0.75, w*0.75);
    this.p.z = mapNoise(this.zOffset, -w*0.75, w*0.75);
  }
  
  show(){
    push();
    translate(this.p.x, this.p.y, this.p.z);
    rotateY(this.rotYDir * frameCount * 0.05 + this.rotYOffset);
    rotateX(this.rotXDir * frameCount * 0.05 + this.rotXOffset);
    rotateZ(this.rotZDir * frameCount * 0.05 + this.rotZOffset);
    noStroke();
    // sphere(200);
    texture(this.txture);
    model(this.mdl);
    pop();
  }
}

const mapNoise = (offset, targetMin, targetMax) => map(noise(offset + frameCount * noiseProgRate), 0, 1, targetMin, targetMax);

const getCol = (p, cntrlRed, cntrlGreen, cntrlBlue) => {
  let redD = p.dist(cntrlRed);
  let greenD = p.dist(cntrlGreen);
  let blueD = p.dist(cntrlBlue);
  return color(d2ColourVal(redD), d2ColourVal(greenD), d2ColourVal(blueD));
}

const d2ColourVal = (d) => map(d, 0, 0.75*w*sqrt(2), 255, 0);




