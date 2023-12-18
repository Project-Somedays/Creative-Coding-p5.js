/*
Author: Project Somedays
Started: 20230-12-17
Title: "House Spiders"
Made for the #WCCChallenge Prompt: "Improbable Architecture"

NOTE: won't currently work on phone --> I'm tired, and haven't worked out how to scale the vector graphics to the windowWidth

Vector graphics from Freepik.com
House: https://www.freepik.com/free-vector/horror-house-poster-with-neglected-building-with-night-cemetery-background-cartoon-vector-illustration_37420275.htm
Spider Legs: https://www.freepik.com/free-vector/sticker-template-with-top-view-spider-isolated_16865645.htm 

babySpidersNightmareFuel array is full of smaller copies of the main housespider following a 2D perlin noise field and wrapping around, but randomising x position when they do to stop them converging on lines
Spider walk cycle is biologically accurate to my best ability thanks to https://www.youtube.com/watch?v=GtHzpX0FCFY: two pairs of 2-leg cycles
Walk cycle is just a sinewave cycle from their base offset. Looks a little funny, but I've spent enough time on this already =)

To improve on next time:
- make the legs different sizes
- do inverse kinematics to make the walk cycle move forward instead of just legs wiggling back and forth
- work out a much cleaner way to doing the multiple-segment legs
- animate more segments of the spider legs
- fix the scaling issues? Doesn't work so well on phones for some reason?

For debate: which way to house spiders walk? Is door = mouth or door = spinneretts/silk poop tubes. Discuss.

My original idea was to have the large spider rappel down, lay some eggs and then the baby spiders would burst out and escape the screen
This will do for now
*/


let mummaSpider;
let imgHouse;
let imgLegBase;
let imgLegTip;
let scaleToWindowWidthFactor; // How I've used this is VERY clunky. Any thoughts for improvements? 
let noiseZoomFactor = 300;
let noiseAOffsetSpeed = 0.003;
let babySpidersNightmareFuel = [];
let babySpiderScaleFactor = 0.035;
let babySpiders = 150; // running slow? Try dropping the number of spiders
let margin = 100;
let dangleCycleSpeed = 0.01;
let dangleMagFraction = 0.1;
let walkCycleSpeed = 0.3;


function preload(){
  imgHouse = loadImage("images/Creepy House.png");
  imgLegBase = loadImage("images/BaseSegment.png");
  imgLegTip = loadImage("images/TipSegment.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleToWindowWidthFactor = 0.15*width/imgHouse.width;
  mummaSpider = new HouseSpider(width/2, height/2, 0);
  // console.log(`New House spider at (${mummaSpider.p.x},${mummaSpider.p.y})`);
  for(let i = 0; i < babySpiders; i++){
    babySpidersNightmareFuel.push(new HouseSpider(random(width), random(height),0));
  }

  pixelDensity(1);

  strokeWeight(5);
}

function draw() {
  background(0);
  fill(255);
  
  
  updateAndShowBabySpiders();
  // ellipse(width/2, height/2, 200, 200);
  fill(0,100);
  noStroke();
  // fade the background spiders
  rect(-5, 5, width + 10, height + 10);
  // draw the silk line
  stroke(255);
  line(mummaSpider.p.x, 0, mummaSpider.p.x, mummaSpider.p.y);
  mummaSpider.updateDangle();
  mummaSpider.show(false);
}

function updateAndShowBabySpiders(){
  for(let i = 0; i < babySpidersNightmareFuel.length; i++){
    let a = map(noise(babySpidersNightmareFuel[i].p.x/noiseZoomFactor, babySpidersNightmareFuel[i].p.y/noiseZoomFactor),0,1,PI,TWO_PI);
    let v = p5.Vector.fromAngle(a).setMag(4);
    babySpidersNightmareFuel[i].p.add(v);
    // wrapping and randomizing positions
    if(babySpidersNightmareFuel[i].p.x < -margin){
      babySpidersNightmareFuel[i].p.x = width + margin;
      babySpidersNightmareFuel[i].p.y = random(height);
    }
    if(babySpidersNightmareFuel[i].p.x > width + margin){
      babySpidersNightmareFuel[i].p.x = -margin ;
      babySpidersNightmareFuel[i].p.y = random(height);
    }
    if(babySpidersNightmareFuel[i].p.y < -margin){
      babySpidersNightmareFuel[i].p.y = height + margin;
      babySpidersNightmareFuel[i].p.x = random(width);
    }
    if(babySpidersNightmareFuel[i].p.y > height + margin){
      babySpidersNightmareFuel[i].p.y = -margin;
      babySpidersNightmareFuel[i].p.x = random(width);
    }
    babySpidersNightmareFuel[i].updateWalk();
    push();
      translate(babySpidersNightmareFuel[i].p.x, babySpidersNightmareFuel[i].p.y);
      rotate(a+HALF_PI+PI);
      scale(babySpiderScaleFactor, babySpiderScaleFactor);
      babySpidersNightmareFuel[i].show(true);
    pop();  
  }

  }

