
let colours= [];
let shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colours = [color(174, 81, 78), color(221, 198, 77), color(14, 114, 158)];
  
}

function draw() {
  background(0);
  // noStroke();
  for(let shape of shapes){
    shape.show();
  }

}


class CustomShape{
  constructor(x,y, n){
    this.p = createVector(x,y);
    this.n = n;
    this.rot = random(TWO_PI);
    this.vertices = []
    this.colour = random(colours);
    for(let i = 0; i < this.n; i++){
      let baseAngle = i*TWO_PI/this.n;
      let a = baseAngle + random(-PI/6, PI/6);
      let r = random(0.25*height, 0.45*height);
      this.vertices.push(createVector(r*cos(a), r*sin(a)));
    }
  }

  show(){
    fill(this.colour);
    push();
      translate(this.p.x, this.p.y);
      rotate(this.rot);
      beginShape();
        for(let v of this.vertices){
          vertex(v.x, v.y);
        }
      endShape(CLOSE);

    pop();
  }
}

function mousePressed(){
  if(random() < 0.2) {
    n = 3;
  } else {
    
    n = 4;
  }
  console.log(n);
  shapes.push(new CustomShape(mouseX, mouseY, n));
}
