/*
Author: Project Somedays
Date: 2025-01-08
Title: Genuary 2025 Day 8 - Draw a million of something. Attempt 1.

RESOURCES:
- Penguin Model: Penguin by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/fBXvsC6pe_V)


Hmmm. I've spent WAY too much time on this. Will come back to it one day. Maybe.
*/

let oceanColour;
let noiseZoom;
let res;
let icebergs = [];
const bergs = 1;

let penguin;
let penguinTexture;
let icebergColour;
let penguinLocations = [];
let penguinEdgeMargin = 0.975;

let waves;

function preload(){
  waves = loadImage("mesmerizing-shot-crystal-blue-ocean-waves_181624-48854.jpg");
  penguin = loadModel("Mesh_Penguin.obj",true,()=> console.log("Loaded penguin model"));
  penguinTexture = loadImage("Tex_Penguin.png", ()=> console.log("Loaded penguin texture"));
}

let gui, params;
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // createCanvas(1080, 1920, WEBGL);

  oceanColour = color("#0f5ea3");
  oceanColour.setAlpha(100);

  icebergColour = "#15a7eb";

  


  for(let i = 0; i < bergs; i++){
    let x = 0//r*cos(a);
    let z = 0//r*sin(a);
    let bergW = 1000;//random(width/5, width/2);
    let bergL = 1000;//random(width/5, width/2);
    let bergH = random(height/6, height/3);
    let iceberg = new Iceberg(x, z, bergW, bergL, bergH, 30, 6, 150, height/10, height/4);
    icebergs.push(iceberg);

    // cover in penguins;
    let penguinsPerBerg = 20*sqrt(iceberg.bergLength * iceberg.bergWidth);
    for(let j = 0; j < penguinsPerBerg; j++){
      let penguinX = x + random(-penguinEdgeMargin*iceberg.bergLength/2, penguinEdgeMargin*iceberg.bergLength/2);
      let penguinZ = z + random(-penguinEdgeMargin*iceberg.bergWidth/2, penguinEdgeMargin*iceberg.bergWidth/2);
      //finding nearest coordinate
      let xIndex = int((penguinX + iceberg.bergLength/2)/iceberg.res);
      let zIndex = int((penguinZ + iceberg.bergWidth/2)/iceberg.res);
      let penguinY = iceberg.surfaces[0][xIndex][zIndex].y; 
      
      let rot = random(TWO_PI);
      penguinLocations.push({p : createVector(penguinX,penguinY,penguinZ), rot: rot});
  }
  // let penguinsPerBerg = 20*sqrt(iceberg.bergLength * iceberg.bergWidth);
  // let localPenguinLocations = generateNPoissonPoints(iceberg, 0, penguinsPerBerg, 10);
  // penguinLocations.concat(localPenguinLocations);
}

gui = new lil.GUI();

  params = {
    showTopSurface : true,
    showBottomSurface: true,
    showStroke: false,
    showNormals: false,
    specularMaterialOn: true,
    autoRotate: true,
    penguinsShown: 1000,
    penguinScale: 0.05,
    penguinHeightOffset: 5
  }

  gui.add(params, 'showTopSurface');
  gui.add(params, 'showBottomSurface');
  gui.add(params, 'showNormals');
  gui.add(params, 'showStroke');
  gui.add(params, 'specularMaterialOn');
  gui.add(params, 'autoRotate');
  gui.add(params, 'penguinsShown', 1, penguinLocations.length, 1);
  gui.add(params, 'penguinScale', 0.01, 0.1);
  gui.add(params, 'penguinHeightOffset', -20, 20, 1);

}

function draw() {
  background("#b8dbf2");
  let a = frameCount*TWO_PI/900;
  // let lightDir = createVector(cos(a), sin(a), sin(a));
  let lightDir = createVector(-1, -0.5, 0);
  directionalLight(255, 255, 255, lightDir);
  directionalLight(255, 255, 255, lightDir.mult(-1));
  // ambientLight(255,255,255);
    
  if(params.autoRotate) rotateY(a);

  
  push()
  translate(0,-height/6,0);
  noStroke();
  if(params.showStroke) stroke(0);
  for(let iceberg of icebergs){
    if(params.specularMaterialOn) specularMaterial(255);
    fill(icebergColour);
    if(params.showNormals) normalMaterial();
    push();
    translate(iceberg.p.x,0, iceberg.p.z);
    iceberg.render();
    pop();
  }
   
  

    noLights();
  
// covering the top surface in penguins
for(let i = 0; i < params.penguinsShown; i++){
  let penguinLocation = penguinLocations[i];
  push();
    translate(penguinLocation.p.x, penguinLocation.p.y + params.penguinHeightOffset, penguinLocation.p.z);
    scale(params.penguinScale);
    rotateX(PI); // turn right-side up
    rotateY(penguinLocation.rot); // rotate randomly
    texture(penguinTexture);
    model(penguin);
  pop();
}

pop();
  


/// draw water plane
   noStroke();
   noLights();
   fill(oceanColour);
   push();
   rotateX(HALF_PI);
   plane(8*width, 8*height);
   pop();

orbitControl();




}

function keyPressed(){
  if(key.toLowerCase() === 's'){
    save("One Million Penguins.png");
  }
}

function generateNPoissonPoints(berg, surfaceIndex, n, minDistance) {
  function getRandomSurfacePoint() {
      const margin = berg.res;
      const x = random(-berg.bergLength/2 + margin, berg.bergLength/2 - margin);
      const z = random(-berg.bergWidth/2 + margin, berg.bergWidth/2 - margin);
      const y = berg.getSurfaceHeight(x, z, surfaceIndex);
      return y !== null ? createVector(x, y, z) : null;
  }

  function distanceToClosestPoint(point, points) {
      let minDist = Infinity;
      for (let p of points) {
          const d = p5.Vector.dist(point, p);
          minDist = min(minDist, d);
      }
      return minDist;
  }

  const points = [];
  const maxAttempts = 30;
  
  // Get first point
  let firstPoint;
  do {
      firstPoint = getRandomSurfacePoint();
  } while (firstPoint === null);
  points.push(firstPoint);

  // While we need more points
  while (points.length < n) {
      let bestPoint = null;
      let bestDist = -Infinity;

      // Try multiple candidate points
      for (let i = 0; i < maxAttempts; i++) {
          const candidate = getRandomSurfacePoint();
          if (candidate === null) continue;

          const dist = distanceToClosestPoint(candidate, points);
          
          // If this point maintains minimum distance and is better spaced than previous candidates
          if (dist >= minDistance && dist > bestDist) {
              bestPoint = candidate;
              bestDist = dist;
          }
      }

      // If we couldn't find a valid point, reduce minimum distance
      if (bestPoint === null) {
          minDistance *= 0.9;
          continue;
      }

      let rot = random(TWO_PI);
      points.push({p: bestPoint, rot: rot});
  }

  return points;
}