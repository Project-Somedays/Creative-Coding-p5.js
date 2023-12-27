const s = 50;
let population = [];
let n = 200;
let startR;
let los;
let all = [];
let colours = ["#d9ed92","#b5e48c","#99d98c","#76c893","#52b69a","#34a0a4","#168aad","#1a759f","#1e6091","#184e77"];

function setup() {
  createCanvas(windowHeight, windowHeight);
  los = width/8;
  startR = 0.45*width/2;
  population = populateTribe(colours);
  background(0);
}

function draw() {
  updateAndShowAll();

}

function updateAndShowAll(){
  for(let tribesman of population){
      target = getTargetLocation(tribesman, population);
      tribesman.update(target);
      tribesman.show();
    }
  }


function populateTribe(colours){
  population = [];
  for(let i = 0; i < n; i++){
    let a = random(TAU);
    let x = width/2 + startR*cos(a);
    let y = height/2 + startR*sin(a);
    let col = random(colours);
    population.push(new Tribesman(x,y, col));
  }
  return population;
}

function getTargetLocation(tribesman, tribespeople){
  let avx = 0;
  let avy = 0;
  let withinLos = tribespeople.filter(t => {t.colour === tribesman.colour && p5.Vector.dist(t.p, tribesman.p) <= los});
  for(let t of withinLos){
    avx += t.p.x;
    avy += t.p.y;
  }
  return createVector(avx/withinLos.length, avy/withinLos.length);
}
