/*
Author: Project Somedays
Date: 2024-08-03
Tite: Get Horde

RESOURCES:
- Guns: https://www.freepik.com/free-vector/weapons-guns-set_4006211.htm#fromView=search&page=1&position=6&uuid=3bb0e4b3-4ea3-4e6a-888a-3679cef6cf4e
- Zombies: https://www.freepik.com/free-vector/hand-drawn-flat-halloween-zombies-collection_18394206.htm#fromView=search&page=1&position=1&uuid=242553ec-2d5f-4122-a608-cfe30d257be0
- Crate: https://www.freepik.com/free-vector/wooden-crate-white-background_28458633.htm#fromView=search&page=1&position=27&uuid=4b27adf9-1e88-4d25-bc8a-a3e774bf64ba
*/

let bullets = [];
let players = [];
let pistolFlintLock;
let enemies = [];
let powerups = [];
let startWave = 10;
let debugMode = true;
let enemyBasic, enemyScreamer, enemyTough, enemyFreqTable;
const globFrameRate = 30;
let spawnRate = 30;
let spriteBasic, spriteScreamer, spriteTough;

let pistolFlintlock, pistolRevolver, pistolSnubnosed, pistolDesertEagle, shotgun, subUzi, subUMP, arM16A4;
// TODO: Shuffle gait

function preload(){
  spriteBasic = loadImage("basic.png");
  spriteScreamer = loadImage("screamer.png");
  spriteTough = loadImage("tough.png");
}


function setup() {
  // createCanvas(min(windowWidth,windowHeight)/2, min(windowWidth, windowHeight));
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(globFrameRate);
  
  pistolFlintlock = {
    name : "Flintlock Pistol",
    fireRate: 60,
    spread: TWO_PI/60,
    bulletSpeed: windowHeight/50,
    baseDamage: 1,
    penetration: 1
  }

  players.push(new Player(pistolFlintLock));



  

  enemyBasic = {
    scl: 0.1*width/spriteBasic.width,
    health: 1,
    speed: 1,
    rangeOfSight: width/5,
    damagePerHit: 5,
    damageRate: globFrameRate,
    damageRange: 0.025*width,
    colour: color(255, 255, 0),
    img: spriteBasic
  }

  enemyTough = {
    scl:  0.2*width/spriteTough.width,
    health: 5,
    speed: 1.5,
    rangeOfSight: width/4,
    damagePerHit: 10,
    damageRate: int(0.75*globFrameRate),
    damageRange: 0.05*width,
    colour: color(255, 0, 255),
    img: spriteTough
  }

  enemyScreamer = {
    scl: 0.08*width/spriteScreamer.width,
    health: 1,
    speed: 2,
    rangeOfSight: width/5,
    damagePerHit: 2,
    damageRate: globFrameRate,
    damageRange: 0.02*width,
    colour: color(0, 255, 255),
    img: spriteScreamer
  }

  enemyFreqTable = new Map()
  enemyFreqTable.set(enemyBasic, 20);
  enemyFreqTable.set(enemyScreamer, 3);
  enemyFreqTable.set(enemyTough, 1);

  enemies.push(spawnRandomEnemy());
  
}

function draw() {
  background(0);
  for(let player of players){
    player.update()
    player.show();
  }
  

  if(frameCount%spawnRate === 0) enemies.push(spawnRandomEnemy());

  enemies = enemies.sort((a,b) => b.p.y - a.p.y);
  handleBullets(enemies);
  handleHittables(enemies);
  takeDamageFromEnemies(enemies);
  enemies = enemies.filter(e => !e.isDead);
  players = players.filter(e => !e.isDead);


  if(!debugMode) return;
  fill(255);
  text(`Bullets: ${bullets.length}`,0,height/100);
  text(`Enemies: ${enemies.length}`,0,height/100+textSize());
  
  if(players.length === 0) gameOver();
}

function gameOver(){
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(255);
  text("GAME OVER", width/2, height/2);
  noLoop();
}

function progressEnemies(){
  for(let e of enemies){
    e.update();
    e.show();
  }
}

function takeDamageFromEnemies(enemies){
  for(let player of players){
    for(let e of enemies){
      if(registerHit(e.p, player.p, e.range)) player.damage(e.dealDamage());
    }
  }
}

function registerHit(a, b, threshold){
  return p5.Vector.dist(a,b) <= threshold;
}

function handleHittables(hittableThings){
  if(hittableThings.length === 0) return;
  for(let i = hittableThings.length - 1; i >= 0; i--){
    hittableThings[i].update();
    hittableThings[i].seek(players.map(e => e.p));
    hittableThings[i].show();
  }
}

function cleanUpHittables(hittableThings){
  for(let i = hittableThings.length - 1; i >= 0; i--){
    if(hittableThings[i].isDead) enemies.splice(i,1);
  }
  
}

function handleBullets(hittableEntities){
  if(hittableEntities.length === 0 || bullets.length === 0) return;

  for(let i = bullets.length - 1; i >= 0; i--){
    bullets[i].update(); // move and register isSpent if offscreen
    for(let hittable of hittableEntities){
      if(registerHit(bullets[i].p, hittable.p, hittable.r)){
        hittable.takeDamage(bullets[i].damage);
        bullets[i].registerHit();
      } 
    }
    bullets[i].show();
    if(bullets[i].isSpent) bullets.splice(i,1);
  }
}

function sampleFromDistribution(freqMap) {
  // Calculate the total sum of relative frequencies
  const totalFrequency = Array.from(freqMap.values()).reduce((sum, frequency) => sum + frequency, 0);

  // Generate a random number between 0 and totalFrequency
  const randomNum = Math.random() * totalFrequency;

  // Iterate through the Map to find where the random number falls
  let cumulativeFrequency = 0;
  for (const [thing, frequency] of freqMap) {
      cumulativeFrequency += frequency;
      if (randomNum < cumulativeFrequency) {
          return thing;
      }
  }
}
