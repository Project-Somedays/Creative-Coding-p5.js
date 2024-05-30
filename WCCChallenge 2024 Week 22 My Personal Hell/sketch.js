/*
Author: Project Somedays
Date: 2024-05-29
Title: WCCChallenge "My Personal Hell"

Made for Sableraph's weekly creative coding challenges, reviewed weekly on https://www.twitch.tv/sableraph
Join The Birb's Nest Discord community! https://discord.gg/S8c7qcjw2b

I don't know about anyone else, but I find Sushi trains really stressful. This game captures that experience. My highest score is 20 with a increase difficulty rate of 10%. Good luck!

############# RESOURCES #################
Inverse Kinematics code adapted from our Lord and Saviour Daniel Shiffman's work: https://www.youtube.com/watch?v=hbgDqyy8bIw
Sumo Art from Night Cafe: https://creator.nightcafe.studio/creation/faiwEmZzCBblpxrKSPcX?ru=projectsomedays
Sushi Art from Freepik: https://www.freepik.com/free-vector/hand-drawn-kawaii-sushi-collection_4097571.htm#fromView=search&page=1&position=11&uuid=41d4e717-b9ad-47d1-b877-a5ad3dfe0a19
Music: "Japanese Battle" by https://pixabay.com/music/adventure-japanese-battle-164989/
Flamethrower: https://pixabay.com/sound-effects/flame-thrower-128555/
Eating sound effect: https://pixabay.com/sound-effects/eating-sound-effect-36186/
Flamethrower: https://pixabay.com/sound-effects/084303-hq-flamethrower-87072/
Font: https://www.dafont.com/almost-japanese-comic.font


############# TODO's AND OPPORTUNITIES ##############
DONE: Burn Pile
DONE: Speed Increase on Success
DONE: Sound Effects
DONE: Music
DONE: Game Over
DONE: Make Screen Responsive
DONE: Robot Arm - grabber
TODO: Loading Screen
TODO: Robot Arm - flamethrower
TODO: FOMO/Anger meter

*/

// #################### VARIABLES ####################### //

// -------- SCALING --------- //
let cnv;
let yardstick;
let handScale;
let sumoScale;

// ---------- SUMO ---------- //
let sumo;
let sumoOpen;
let sumoClosed;
let mouth;

// ------ THOUGHT BUBBLE --------- //;
let thoughtBubbleP;
let thoughtBubble;
const bubbleRate = 200;

// -------- SUSHI --------- //
let targetSushi;
let sushiTrainHeight;
let sushi = [];
let sushiCycleFrames = 120;
let sushiTrain = [];
let newSushiFrame = 60;
let trainRate = 3;

// --------- ARM ----------- //
const armSegments = 50;
let m;
let maxLength;
let handMode = false;
let legacyArmMode = false;
let hand;
let extraArms = [];
let arm;
const armMovementRate = 100;

// --------- FONT ---------- //
let font;

// ---------- SOUNDS ---------- //
let soundsEating;
let soundsWrong;
let soundsFlamethrower;
let soundsCollectPoints;

// ------- FLAMETHROWER ---------//
let flamethrower;
let flames = [];

// --------- SCORES ---------- //;
let music;
let score = 0;
let chances = 5;
let burnedImg;
const increaseDifficultyRate = 1.1;

// #################### PRELOAD ####################### //

function preload(){
  // images
  sumoOpen = loadImage("images/SumoOpen.png");
  sumoClosed = loadImage("images/SumoClosed.png");
  for(let i = 0; i < 9; i++){ sushi.push(loadImage(`images/Sushi${i+1}.png`)); }
  for(let i = 0; i < 6; i++){ flames.push(loadImage(`images/Fire${i+1}.png`)); }
  burnedImg = loadImage("images/Burned.png");
  flamethrower = loadImage("images/flamethrower.png");
  music = loadSound("sounds/japanese-battle-164989.mp3");
  hand = loadImage("images/Hand.png");
  
  // sounds
  soundsCollectPoints = loadSound("sounds/collect-points-190037.mp3")
  soundsEating = loadSound("sounds/eating-sound-effect-36186.mp3");
  soundsWrong = loadSound("sounds/wrong-buzzer-6268.mp3");
  soundsFlamethrower = loadSound("sounds/084303_hq-flamethrower-87072.mp3");
  
  // font
  font = loadFont("Almost Japanese Comic.ttf");
}


// #################### SETUP ####################### //


function setup() {
  describe("Our sumo friend is hungry! Use the tentacle to feed him what he wants but be warned! You touch it, you buy it! 5 strikes and you're out.");
  // createCanvas(1080, 1080);
  createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  imageMode(CENTER);
  noCursor();

  cnv = createGraphics(width, height);
  

  // ----- SCALING ----- ///
  yardstick = min(width, height);
  handScale = (0.15*yardstick)/hand.width;
  sumoScale = width/sumoOpen.width;

  // ----- SUSHI ------ //
  sushiTrainHeight = 0.5*height;
  sushiTrain.push(new Sushi(random(sushi)));  
  
  // ------ SUMO ------- //
  sumo = new Sumo(width/2, height/2);
  mouth = createVector(sumoOpen.height)
  

  // ----- ARMS ----- //
  m = createVector(mouseX, mouseY);
  maxLength = height*0.75/armSegments;
  arm = new Arm(width/2, height, m.x, m.y);
  // for(let i = 0; i < 3; i++){
  //   extraArms.push(new Arm(width/2, height, width/2, height/2));
  // }

  // ------- THOUGHT BUBBLE --------- //
  thoughtBubbleP = createVector(width*0.1, height*0.1);
  thoughtBubble = new ThoughtBubble(thoughtBubbleP.x, thoughtBubbleP.y, 0.25*width, 0.25*height, 30);
  

  // ----- TEXT -------- //
  textAlign(CENTER, CENTER);
  textSize(height/10);
  textFont(font);
  textLeading(height/15);

  // ------- START ------- //
  music.loop();
  music.setVolume(0.5);
  getNewTargetSushi();
}

// #################### DRAW ####################### //

function draw() {
  background(0);

  m.set(mouseX, mouseY);
  cnv.fill(0);
  cnv.rect(0,0,cnv.width, cnv.height);
  
  drawThoughtBubble();
  
  sumo.show();

   // -------- ARM --------- //
   noFill();
   arm.setTarget(m);
   arm.update();
   arm.show();
  //  updateExtraArms();
  
  targetSushi.show();

  for(let s of sushiTrain){
    s.update();
    if(s.p.x > width*1.1) s.moveToBottomRow();
    s.show();
  }

  if(frameCount%newSushiFrame === 0){
    sushiTrain.push(new Sushi(random(sushi)));
  }

  // clean up sushiTrain
  for(let i = sushiTrain.length-1; i >= 0; i--){
    if(sushiTrain[i].p.x < -width*1.1) sushiTrain.splice(i,1);
  }

  // ------ FLAME THROWER ------- //;
  // push();
  // translate(width*0.4, mouseY*0.6);
  // image(flamethrower, width/2, height/2, flamethrower.width*0.75, flamethrower.height*0.75);

  // pop();

  // ------- SHOW SCORE --------- //
  fill(255);
  noStroke();
  text(`Score\n${score}`, width/2 - width*0.25, height*0.8);
  // image(burnedImg,width/2 + width*0.1, height*0.8);
  text(`Chances\n${chances}`, width/2 + width*0.25, height*0.8);

  // image(random(flames), width/2, height/2);

  if(chances === 0){
    gameOverScreen();
  }

  
}

// #################### HELPER FUNCTIONS ####################### //

function updateExtraArms(){
  for(let i = 0; i < extraArms.length; i++){
    let x = map(noise(i*1200 + frameCount/armMovementRate),0,1,0,width); 
    let y = map(noise(i*1500 + frameCount/armMovementRate), 0, 1, height, 0.75*height);
    extraArms[i].setTarget(createVector(x,y));
    extraArms[i].update();
    extraArms[i].show();
  }
}

function gameOverScreen(){
  background(0);
  textSize(height/6);
  text("GAME OVER", width/2, height/2-height/30);
  textSize(height/10);
  text(`Final Score: ${score}`, width/2, height/2 + height/15);

}


function mousePressed(){
  if(mouseButton === LEFT){
    for(let s of sushiTrain){
      if(p5.Vector.dist(s.p, m) < width*0.05){
        s.isSelected = true;
      }
    }
  }
}

function mouseDragged(){
  for(let s of sushiTrain){
    if(s.isSelected) s.follow(m);
  }
}

function mouseReleased(){
  for(let i = sushiTrain.length-1; i >= 0; i--){
    if(!sushiTrain[i].isSelected) continue;
    if(sushi.indexOf(sushiTrain[i].sushiImg) === sushi.indexOf(targetSushi.sushiImg) && p5.Vector.dist(sushiTrain[i].p, sumo.mouth) < sumo.threshold){
      score++;
      trainRate *= increaseDifficultyRate;
      newSushiFrame = int(newSushiFrame*(1/increaseDifficultyRate));
      soundsCollectPoints.play();
      soundsEating.play();
    } else{
      chances--;
      soundsWrong.play();
      soundsFlamethrower.play();
    }
    sushiTrain.splice(i,1);
    getNewTargetSushi();
  } 
}


function drawThoughtBubble(){
  cnv.fill(255);
  cnv.circle(width*0.275 + width*0.025*noise(frameCount/bubbleRate + 1000), height*0.2 + height*0.025*noise(frameCount/bubbleRate + 2000), width*0.04);
  cnv.circle(width*0.325 + width*0.0125*noise(frameCount/bubbleRate + 3000), height*0.225 + height*0.0125*noise(frameCount/bubbleRate + 4000), width*0.025);
  cnv.circle(width*0.36 + width*0.00625*noise(frameCount/bubbleRate + 5000), height*0.225 + height*0.00625*noise(frameCount/bubbleRate + 6000), width*0.0125);
  thoughtBubble.update();
  thoughtBubble.show(cnv);
  image(cnv, width/2, height/2);
}

function getNewTargetSushi(){
  targetSushi = new Sushi(new random(sushi));
  targetSushi.p.set(thoughtBubbleP.x, thoughtBubbleP.y);
}
