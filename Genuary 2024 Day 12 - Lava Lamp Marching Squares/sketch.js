/*
Author: Project Somedays
Date: 2024-02-15
Title: Genuary 2024 Day 12 - Lava Lamp via Marching Squares

Inspiration from Patt Vira: https://www.youtube.com/watch?v=wiPwD5nO7Ig and Daniel Shiffman https://www.youtube.com/watch?v=0ZONMNUKTfU
*/

const res = 5;
const s = 50;
let rows, cols;
let testBlobA, testBlobB;
let testBlobs = [];
const n = 4;



function setup(){
  createCanvas(500, 500, P2D);
  stroke(255);
  strokeWeight(5);
  rows = height/res + 1;
  cols = width/res + 1;
  testBlobs = [];
  for(let i = 0; i < n; i++){
    testBlobs.push(new Waxblob());
  }
  // testBlobs = [testBlobB]
  // console.log(testBlobs);


}

function draw(){
background(0);
noFill();
for(let b of testBlobs){
  b.update();
  // b.show();
}
// circle(mouseX, mouseY, s);
// testBlobB.p.set(mouseX, mouseY);
// testBlobA.update();



// construct the grid
let grid = [];
for(let col = 0; col < cols; col++){
  let column = [];
  for(let row = 0; row < rows; row++){
    let x = col*res;
    let y = col*res;
    let v = 0;
    for(let b of testBlobs){
      v += Math.pow(b.r,2) / (Math.pow(col*res - b.p.x, 2) + Math.pow(row*res - b.p.y, 2));
    }
    column.push(v);
  }
  grid.push(column);
}

// draw the grid
noFill();
strokeWeight(1);
for(let col = 0; col < cols - 1; col++){
  for(let row = 0; row < rows - 1; row++){
    // square(col*res, row*res, res);
    // circle(col*res, row*res, 20);
    
    // let a = grid[col][row] >= 1 ? 1 : 0;
    // let b = grid[col + 1][row] >= 1 ? 1 : 0;
    // let c = grid[col + 1][row+1] >= 1 ? 1 : 0;
    // let d = grid[col][row+1] >= 1 ? 1 : 0;

    // using linear interpolation
    let a = createVector(col*res, row*res);
    let b = createVector((col+1)*res, row*res);
    let c = createVector((col+1)*res, (row + 1)*res);
    let d = createVector(col*res, (row+1)*res);

    let va = grid[col][row];
    let vb = grid[col + 1][row];
    let vc = grid[col + 1][row+1];
    let vd = grid[col][row+1]; 

    let sa = va >= 1 ? 1 : 0;
    let sb = vb >= 1 ? 1 : 0;
    let sc = vc >= 1 ? 1 : 0;
    let sd = vd >= 1 ? 1 : 0;

    // text(round(a,1), col*res, row*res- 10);

    let state = sa*8 + sb*4 + sc*2 + sd*1;

    // let p1 = createVector((col+0.5)*res, row*res);
    // let p2 = createVector((col+1)*res, (row+0.5)*res);
    // let p3 = createVector((col+0.5)*res, (row+1)*res);
    // let p4 = createVector((col)*res, (row+0.5)*res);

    let p1 = p5.Vector.lerp(a,b, (1-va)/(vb-va));
    let p2 = p5.Vector.lerp(b,c, (1-vb)/(vc - vb));
    let p3 = p5.Vector.lerp(c,d, (1-vc)/(vd-vc));
    let p4 = p5.Vector.lerp(d,a, (1-vd)/(va-vd));

    



    // get the state
    switch(state){
      case 0:
        break;
      case 1:
        msline(p3, p4);
        break;
      case 2:
        msline(p2, p3);
        break;
      case 3:
        msline(p2,p4);
        break;
      case 4:
        msline(p1,p2);
        break;
      case 5:
        msline(p4,p1);
        msline(p2,p3);
        break;
      case 6:
        msline(p1,p3);
        break;
      case 7:
        msline(p4,p1);
        break;
      case 8:
        msline(p4,p1);
        break;
      case 9:
        msline(p1,p3);
        break;
      case 10:
        msline(p1,p2);
        msline(p3, p4);
        break;
      case 11:
        msline(p1,p2);
        break;
      case 12:
        msline(p2,p4);
        break;
      case 13:
        msline(p2,p3);
        break;
      case 14:
        msline(p3,p4);
        break;
      case 15:
        break;
    }
  }
}



}

const msline = (a, b) => line(a.x, a.y, b.x, b.y);
