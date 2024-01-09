let totoro;
let stack = [];
let loopScale = 1;

function preload(){
  totoro = loadImage("../TotoroV3@2x.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  stack.push(new Totoro(1));
  stack.push(new Totoro(0.1));
  stack.push(new Totoro(0.01));
  
  
}

function draw() {
  background(255);
  
  for(let s of stack){
    s.update();
    s.show();
  }

  // tidying up
  for(let i = stack.length - 1; i >= 0; i--){
    
    if(stack[i].isFinished){
      stack.splice(i,1);
      stack.push(new Totoro());
    }
    
  }
}


class Totoro{
  constructor(startScale){
    this.startScale = startScale;
    this.currentScale = startScale;
    this.isFinished = false;
  }

  update(){
    this.currentScale += 0.001;
    if(this.currentScale/this.startScale === 10){
      this.isFinished = true;
    }

  }

  show(){
    push();
    translate(width/2, height/2);
    scale(this.currentScale);
    image(totoro, 0, 0);
    pop();
  }


}