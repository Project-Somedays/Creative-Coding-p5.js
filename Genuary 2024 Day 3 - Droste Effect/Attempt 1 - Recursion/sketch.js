/*
Author: Project Somedays
Date: 2024-01-03
Title: Genuary 2024 Prompt 3: Droste Effect - Studio Dribbly

First to admit, I brute forced/trial and errored my way through to a NEARLY perfect loop.
VERY keen to see how other people did it because I very much stumbled my way through.

I made the Totoro image square with the centre exactly where I wanted the centre of the next one to appear.
In retrospect, I made this a bit low, but I'm well done with this project.

Pretty sure the loop
*/
let totoro;
const recursionDepth = 6; // this is honestly overkill
const growth = (growthStep) => exp(growthStep); // scaling needs to be done exponentially to keep the speed consistent as it turns out
let growthTracker = 0;
const growthLim = 4.5;
const growthStep = 0.02; // because I got lazy with the looping, growthLim needs to be linked to growthStep in some way but I'm tired so... an exercise for the reader?

function preload(){
  totoro = loadImage("TotoroV3@2x.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  ts = min(height, width)/totoro.height; //scaling Totoro to fit the screen regardless of orientation
}

function draw() {
  background(220);
  
  push();
  translate(width/2, height/2);
  scale(growth(growthTracker)); // grow from the centre of the frame
  
  showTotoro(0);
  pop();

  growthTracker += growthStep;
 
  if(growthTracker >= growthLim){ // restart loop
    growthTracker = 0;
  }

}



function showTotoro(recursionLevel){
  if(recursionLevel === recursionDepth){
    return;
  }
  push();
  image(totoro, 0, 0, totoro.width, totoro.height);
  scale(0.1);
  showTotoro(recursionLevel + 1);
  pop();
  
}

