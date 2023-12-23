let particles = [];
let electrode;
let m;
let electrodeD = 10;
let jitterStrength = 5;
let targetBearing;
let maxAngle;
let maxRange;


function setup() {
  createCanvas(windowWidth, windowHeight);
  maxAngle = PI/6;
  maxRange = width/8;
  m = createVector(mouseX, mouseY);
  electrode = new Particle(width/2, height/2);
  particles.push(electrode);
  let a = random(0,TWO_PI);
  particles.push(new Particle(width/2 + 50*cos(a), height/2 + 50*sin(a)));
  
  targetBearing = getPositiveHeading(p5.Vector.sub(particles[1].p, particles[0].p).heading());

  noFill();
  textAlign(CENTER, CENTER);

}

function draw() {
  background(220);
  m.set(mouseX, mouseY);
  let end2mouseheading = getPositiveHeading(p5.Vector.sub(m, particles[particles.length - 1].p).heading());
  fill(0);
  let isCorrectAngle = isWithinAngle(m, particles[particles.length - 1].p);
  text(`End2Mouse: ${degrees(end2mouseheading)}`, width/2, 10);
  text(`Target: ${degrees(targetBearing)}`, width/2, 50);
  text(`Is Within Angle? ${isCorrectAngle}`, width/2, 100);
  if(isWithinAngle(m, particles[particles.length - 1].p) && isWithinRange(m, particles[particles.length - 1].p)){
    fill(0,255,0);
  } else {
    fill(255, 255, 0);
  }
  circle(m.x, m.y, electrodeD);
  electrode.show()
  for(p of particles){
    p.show();
  }
  drawbolt();
}

function mousePressed(){
  if(mouseButton === LEFT){
    particles.push(new Particle(m.x, m.y));
  }
}

function drawbolt(){
  beginShape();
  origin = particles[0];
  vertex(origin.p.x, origin.p.y);
  prevP = particles[1];
  vertex(prevP.p.x + jitter(), prevP.p.y + jitter());
  for(let i = 2; i < particles.length; i++){
    if(isWithinAngle(particles[i].p, prevP.p) && isWithinAngle(particles[i].p, prevP.p)){
      vertex(particles[i].p.x + jitter(), particles[i].p.y + jitter());
      prevP = particles[i];
    }
  }
  vertex(m.x, m.y);
  endShape(OPEN);
}

function jitter(){
  return random(-jitterStrength, jitterStrength);
}

function getPositiveHeading(heading){
  return heading < 0 ? heading + TWO_PI : heading;
}


function isWithinAngle(endP, startP){
  let angle = p5.Vector.sub(endP, startP).heading()
  return abs(getPositiveHeading(angle) - targetBearing) < maxAngle;
}

function isWithinRange(p1, p2){
  return p5.Vector.dist(p1, p2) < maxRange;
}