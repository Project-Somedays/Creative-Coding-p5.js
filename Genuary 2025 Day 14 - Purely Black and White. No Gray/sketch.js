let side, edgeOffset;
let a;
let animating = false;
let startFrame = 0;
let animationFrames = 7;
let test;
let directions;
let rows = 51;
let cols = 51;
let boxes = [];
let cam;

function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);
  side = width/cols;
  edgeOffset = sqrt(2) * side * 0.5;
  noCursor();
  // ortho();

  cam = createCamera();
  cam.setPosition(width, -width, width);
  cam.lookAt(0,0,0);
  
  frameRate(30);
  directions = [
    {desc: "BACKWARD", dir: createVector(0,0,-1), pivotPt: createVector(0,1,-1)},   
    {desc: "FORWARD", dir: createVector(0,0,1), pivotPt: createVector(0,1,1)},
    {desc: "LEFT", dir: createVector(-1,0,0), pivotPt: createVector(-1, 1, 0)},
    {desc: "RIGHT", dir: createVector(1,0,0), pivotPt: createVector(1,1,0)}
];
    

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      let isBlack = (i*cols + j)%2 === 0
      let x = -width/2 + i*width/cols;
      let z = -height/2 + j * height/rows;
      boxes.push(
      new RollBox(x, isBlack ? side : 0, z, isBlack)
      )
    }
  }
}

function draw() {
  background(0);
  let rot = frameCount*TWO_PI/1200;
  rotateY(rot);

  a = frameCount % animationFrames;
  if(a === 0) triggerAllBoxes(null);
  
 for(let rollbox of boxes){
   rollbox.update();
   rollbox.show();
 }
  
  // console.log(test.a);
  
  
  
  orbitControl();
}

class RollBox{
  constructor(x,y,z, isBlack){
    this.p = createVector(x,y,z);
    this.isAnimating = false;
    this.startFrame = false;
    this.a = 0;
    this.dir = random(directions);
    this.isBlack = isBlack;
    this.startDelay = int(random(animationFrames/2));
  }
  
  startAnimation(customDir = null){
    if(!this.animating) {
      let dir = !customDir ? random(directions) : customDir;
      this.dir = {desc: dir.desc, dir: dir.dir.copy(), pivotPt: dir.pivotPt.copy()}
      console.log(`Moving ${this.dir.dir.x}, ${this.dir.dir.y}, ${this.dir.dir.z} `);
      this.animating = true;
      this.startFrame = frameCount;
    }
  }
  
  update() {
  if (this.animating) {
    this.a = HALF_PI * (frameCount - this.startFrame) / animationFrames;
    // this.a = HALF_PI * a/animationFrames;
    
    if (this.a >= HALF_PI) {
      this.a = 0;  // Reset rotation immediately
      this.p.add(this.dir.dir.mult(edgeOffset * 2));  // Update position
      this.animating = false;
    }
  }
}
  
  show() {
    push();
    translate(this.p.x, this.p.y, this.p.z);
    
    // Adjust translation based on direction
    translate(
        this.dir.pivotPt.x * edgeOffset,
        this.dir.pivotPt.y * edgeOffset,
        this.dir.pivotPt.z * edgeOffset
    );
    
    // do the rotation
    switch(this.dir.desc) {
        case "FORWARD":
            rotateX(-this.a);
            break;
        case "BACKWARD":
            rotateX(this.a);
            break;
        case "RIGHT":
            rotateZ(this.a);
            break;
        case "LEFT":
            rotateZ(-this.a);
            break;
    }
    
    translate(
        -this.dir.pivotPt.x * edgeOffset,
        -this.dir.pivotPt.y * edgeOffset,
        -this.dir.pivotPt.z * edgeOffset
    );
    
    fill(this.isBlack ? color(0) : color(255));
    stroke(this.isBlack ? color(255): color(0));
    box(side, side, side);
    pop();
}
}

function keyPressed(){
  let dir = null;
  switch(keyCode){
    case UP_ARROW:
      dir = {desc: "BACKWARD", dir: createVector(0,0,-1), pivotPt: createVector(0,1,-1)}
      break;
    case DOWN_ARROW:
      dir = {desc: "FORWARD", dir: createVector(0,0,1), pivotPt: createVector(0,1,1)};
      break;
    case LEFT_ARROW:
      dir = {desc: "LEFT", dir: createVector(-1,0,0), pivotPt: createVector(-1, 1, 0)};
      break;
    case RIGHT_ARROW:
      dir = {desc: "RIGHT", dir: createVector(1,0,0), pivotPt: createVector(1,1,0)};
      break;
    case ENTER:
      dir = null;
      break;
    default: 
      break;
  }
  
  triggerAllBoxes(dir);
  
  /*
  {desc: "RIGHT", dir: createVector(1,0,0), pivotPt: createVector(1, 1, 0)},
    {desc: "FORWARD", dir: createVector(0,0,1), pivotPt: createVector(0,1,-1)},    // Changed to use Y axis
    {desc: "LEFT", dir: createVector(-1,0,0), pivotPt: createVector(-1, 1, 0)},
    {desc: "BACKWARD", dir: createVector(0,0,-1), pivotPt: createVector(0,1,1)},
  */
  
  // switch(key.toLowerCase()){
  //   case ' ':
  //     for(let rollbox of boxes){
  //       rollbox.startAnimation();
  //     }
  //     break;
  //   default:
  //     break;
  // }
  
}

function triggerAllBoxes(dir){
  for(let rollbox of boxes){
    rollbox.startAnimation(dir);
  }
}