let drops = [];
let isBlack = false;
let r = 1;
let a = 0;
let val = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  drops.push(new Drop(random(0.25*width, 0.75*width), random(0.25*height, 0.75*height), width/6, isBlack ? color(0) : color(255)));
}

let start;

function mousePressed() {
  start = createVector(mouseX, mouseY);
}


function tineLine(v, x, y, z, c) {
  for (let drop of drops) {
    drop.tine(v, x, y, z, c);
  }
}


function addInk(x, y, r) {
  let drop = new Drop(x, y, r, isBlack ? color(0) : color(255));
  isBlack != isBlack;
  for (let other of drops) {
    other.marble(drop);
  }
  drops.push(drop);
}




function draw() {
  if (mouseIsPressed) {
    let d = dist(mouseX, mouseY, pmouseX, pmouseY);
    addInk(mouseX, mouseY, d);
  }

  // for(let drop of drops){
  //   drop.update();
  // }

  // marbleEverything();

  for(let i = drops.length-1; i >= 0; i--){
    if(drops[i].r > width) drops.splice(i, 1);
  }
  // if (random(1) < 0.01) {
  //   let x = random(width);
  //   let y = random(height);
  //   let r = random(10, 100);
  //   addInk(x, y, r);
  // }

  // if (mouseIsPressed) {
  //   tineLine(mouseX, 4, 16);
  // }
  // let factor = 1;
  // var a = factor * frameCount * 137.5;
  // var r = val * sqrt(factor * frameCount);
  // var x = r * cos(a);
  // var y = r * sin(a);

  // let v = createVector(x, y);
  // let c1 = color(248, 158, 79);
  // let c2 = color(252, 238, 33);
  // v.col = lerpColor(c1, c2, (frameCount % 60) / 60);

  // if (frameCount < 120) {
  //   addInk(v.x + width / 2, v.y + height / 2, val * 1.5);
  //   val += 0.2;
  // }

  background(255);
  for (let drop of drops) {
    drop.show();
  }
}


function marbleEverything(){
  for(let i = 0; i < drops.length; i++){
    for(let j = i; j < drops.length; j++){
      if(i === j) continue;
      drops[i].marble(drops[j]);
    }
  }
}
