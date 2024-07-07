let bullets = [];
let player;
let pistolFlintLock;
let enemies = [];
let powerups = [];
let startWave = 10;
let debugMode = true;
function setup() {
  // createCanvas(min(windowWidth,windowHeight), min(windowWidth, windowHeight));
  
  frameRate(30);
  pistolFlintLock = new Gun("Flintlock Pistol", 60, 0, windowHeight/50, 1);
  player = new Player(pistolFlintLock);
  for(let i = 0; i < startWave; i++){
    let x = (i + 0.5)*width/startWave;
    let y = height/10;
    enemies.push(new Enemy(x,y, 50, 1, 5, width/5));
  }
}

function draw() {
  background(0);
  player.update()
  player.show();
 
  handleBullets(enemies);
  handleHittables(enemies);

  if(!debugMode) return;
  fill(255);
  text(`Bullets: ${bullets.length}`,0,height/100);
  text(`Enemies: ${enemies.length}`,0,height/100+textSize());
  text(`Health: ${player.health}`,0,height/100+2*textSize());
  
}

function progressEnemies(){
  for(let e of enemies){
    e.update();
    e.show();
  }
}

function registerHit(a, b, threshold){
  return p5.Vector.dist(a,b) <= threshold;
}

function handleHittables(hittableEntities){
  for(let i = hittableEntities.length - 1; i >= 0; i--){
    hittableEntities[i].update();
    hittableEntities[i].seek(player.p);
    hittableEntities[i].show();
    if(hittableEntities[i].isDead) enemies.splice(i,1);
  }
}

function handleBullets(hittableEntities){
  for(let i = bullets.length - 1; i >= 0; i--){
    bullets[i].update();
    for(let hittable of hittableEntities){
      if(registerHit(bullets[i].p, hittable.p, hittable.r)){
        hittable.damage(bullets[i].damage);
        bullets[i].registerHit();
      } 
    }
    bullets[i].show();
    if(bullets[i].isSpent) bullets.splice(i,1);
  }
}
