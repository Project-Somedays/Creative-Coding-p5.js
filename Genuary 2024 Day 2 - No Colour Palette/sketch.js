/*
Author: Project Somedays
Date Started: 2024-01-02

Swirling/redistributing colours over time
Colours are chosen from a window of the spectrum
*/

const brushCount = 5;
const aChangeMax = 1; // to be converted degrees to radians
const maxLowerSpectrumCutOffFrac = 0; // where do we want start the spectrum
let colours;
const n = 75; // ultimately sets resolution
let res;
let globOff = 0;
let pSquares = [];
let bMax;
let bMin;
let brushes = [];
let colourOrder;
let orderMap;
let channelAMin;
let channelBMin;
let channelCMin;



function setup() {
  // createCanvas(min(windowHeight,windowWidth), min(windowHeight,windowWidth));
  createCanvas(1080, 1920, P2D);
  frameRate(30);
  pixelDensity(1);
  const colourMin = () => random(maxLowerSpectrumCutOffFrac)*width; // returns the start of the colour window
  
  // making the colour windows
  channelAMin = colourMin();
  channelBMin = colourMin();
  channelCMin = colourMin();
  console.log(`channelAMin = ${channelAMin}, channelBMin = ${channelBMin}, channelCMin = ${channelCMin}`);

  
  

  // a hacky way of changing up the channel order
  colourOrder = shuffle(['channelA','channelB','channelC']);
  orderMap = {};
  for(let i = 0; i < colourOrder.length; i++){
    orderMap[colourOrder[i]] = i;
  }
  console.log(orderMap);

  // setting the bounds of brushes
  bMax = max(width,height)/5;
  bMin = max(width,height)/10;

  // setting the size of the 
  res = height/n;

  
  colorMode(RGB,width); // for convenience, just use the entire width as my range for any given channel
  noStroke();
  rectMode(CENTER);
  

  // set up array of pSquares
  for(let row = 0; row < n; row ++){
    for(let col = 0; col < n; col++){
      let x = (col+0.5)*res;
      let y = (row + 0.5)*res;
      let channelA = map(x,0,width,channelAMin, width);
      let channelB = map(y,0,height,channelBMin, width); 
      let channelC = map(dist(x,y, width/2, height),0,width*sqrt(2),channelCMin, width*sqrt(2));
      let channelData = [channelA, channelB, channelC];
      let r = channelData[orderMap.channelA];
      let g = channelData[orderMap.channelB];
      let b = channelData[orderMap.channelC];
      pSquares.push(new PSquare(x,y,r,g,b));
      // console.log(`channelData: ${channelData}, channelA: ${orderMap.channelA}, r: ${r}, g: ${g}, b:${b}`);
    }
  }

  // init brushes with random noise offsets
  for(let i = 0; i < brushCount; i++){
    brushes.push(new Brush(random(10000), random(10000), random(10000), random(10000)));
  }
  
}

function draw() {
  for(let pSq of pSquares){
    pSq.show();
  }
 
  for(let b of brushes){
    b.update();
    // b.show();
  }
  swirl();
  globOff += 0.01;
}

function swirl(){
  // swirl the colours around the brushes
  for(let b of brushes){
    for(let p of pSquares){
      let d = p5.Vector.dist(p.p, b.p)
      if(d > b.r){ // if out of range, don't worry about it
        continue;
      }
      // else, rotate the pSquare by the brushes current angular displacement factor
      let h = p5.Vector.sub(p.p, b.p).heading();
      let x = b.p.x + d*cos(h + b.a);
      let y = b.p.y + d*sin(h + b.a);
      p.update(x,y);
      }
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function keyPressed(){
  if(key === ' '){
    noLoop();
    let timestamp = new Date().toJSON();
    saveCanvas("Genuary2024_Prompt2_NoColourPalettes_ProjectSomedays " + timestamp);
  }
}