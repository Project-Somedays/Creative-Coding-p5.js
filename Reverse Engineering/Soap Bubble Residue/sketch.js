let n = 100;
let zoomFactor = 50;
const sMax = 5;
const aRate = 0.01;

bubbleRings = [];
function setup() {
  createCanvas(windowHeight, windowHeight);
  noStroke();
  fill(255);
  for(let i = width/4; i < 0.8*width; i += 3){
    let x = i;
    let y = height/2;
    let d = mapXPosition(x, height/3, height);
    let orientation = mapXPosition(x, -PI/6, PI/6);
    let e = mapXPosition(x, 0.2,0.5);
    bubbleRings.push(new BubbleRing(x,y,d, orientation, e))
  }
  
  
}

function draw() {
  background(0);
  for(let b of bubbleRings){
    b.update();
    b.show();
  }
  
}

class BubbleRing{
  constructor(x,y,d, orientation, e){
    this.c = createVector(x,y);
    this.r = d/2; 
    this.aOff = random(10000);
    this.orientation = orientation;
    this.e = e;
  }

  update(){
    this.aOff += 0.01;
  }

  show(){
    push();
    translate(this.c.x, this.c.y);
    rotate(this.orientation + this.aOff);
    for(let i = 0; i < n; i++){
      let a = i*TAU/n - this.aOff/2; // + this.aOff;
      let nVal = noise((this.aOff + a)/zoomFactor*2);
      let s = map(nVal,0,1,0,sMax);
      circle(this.e*this.r*cos(a),this.r*sin(a), s);
    }
    pop();
  }
}

function mapXPosition(x, minVal, maxVal){
  return map(noise(x/zoomFactor),0,1,minVal, maxVal);
}