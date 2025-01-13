let digitToDirectionMap = {};
const digits = 1000000;
let test = [];
let p;
let step = 10;
let params, gui;
let locations = [];
let boundingR;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  console.log(test);
  boundingR = width/2;
  
  for(let i = 0; i < 10; i++){
    digitToDirectionMap[i.toString()] = getSpherePoint(i, 10, 1);
  }

  console.log(digitToDirectionMap);
  noFill();
  stroke(255);

  for(let i = 0; i < digits; i++){
    test.push(int(random(10)));
  }


  locations.push(createVector(0,0,0)); // start in the centre
  for(let i = 1; i < test.length; i++){
    let digit = test[i]; // load the next digit
    let newDir =  p5.Vector.mult(digitToDirectionMap[digit],step); // get the direction and scale by step
    let p = p5.Vector.add(locations[i-1], newDir); // load the previous endpoint and step in that direction
    let d = dist(p.x, p.y, p.z, 0, 0, 0); // is it inside the bounding sphere?
    if(d > boundingR){ // if it isn't, take a step back toward the centre of the sphere;
      let dirs = generateInwardDirections(p);
      let dir = dirs[int(digit)].mult(step);
      p.add(dir);
    }  
    locations.push(p);
   
  }

  gui = new lil.GUI();
  params = {
    showNDigits : digits
  }

  gui.add(params, 'showNDigits', 100, digits, 1);


  background(0);
  beginShape();
  vertex(locations[0].x, locations[0].y, locations[0].z);
  for(let i = 0; i < params.showNDigits; i++){
    let p = locations[i];
    curveVertex(p.x, p.y, p.z);
  }
  endShape();

}

function draw(){
  // background(0);
  // rotateY(frameCount * TWO_PI/1200);
 
 
  // orbitControl();

}

function getSpherePoint(index, numPoints = 10, radius = 1.0) {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  
  // Generate points using Fibonacci spiral method
  const theta = 2 * Math.PI * index / goldenRatio;
  const phi = Math.acos(1 - 2 * (index + 0.5) / numPoints);
  
  // Convert spherical coordinates to Cartesian
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  
  return createVector(x,y,z);
}


function generateInwardDirections(p) {
  const directions = [];
  const normal = p.copy().normalize(); // Unit vector pointing outward from center
  
  // Create a basis for the tangent plane
  let u = createVector(1, 0, 0);
  if (abs(normal.dot(u)) > 0.9) {
    u = createVector(0, 1, 0);
  }
  const tangent1 = p5.Vector.cross(normal, u).normalize();
  const tangent2 = p5.Vector.cross(normal, tangent1).normalize();
  
  // We'll generate points in a cap of the unit sphere
  // The cap's axis is -normal (pointing inward)
  // We'll use a maximum angle of 90 degrees (π/2) from -normal
  const numRings = 3;
  const ptsPerRing = [1, 4, 5]; // Numbers sum to 10
  
  // Start with the central direction (straight inward)
  directions.push(normal.copy().mult(-1));
  
  // Generate rings of points
  for (let ring = 1; ring < numRings; ring++) {
    const phi = (ring / numRings) * (HALF_PI); // Angle from -normal
    const ringRadius = sin(phi);
    const ringHeight = -cos(phi);
    
    // Generate points around this ring
    for (let i = 0; i < ptsPerRing[ring]; i++) {
      const theta = (i / ptsPerRing[ring]) * TWO_PI;
      
      // Construct vector in local coordinates
      const x = ringRadius * cos(theta);
      const y = ringRadius * sin(theta);
      const z = ringHeight;
      
      // Transform to global coordinates using our basis
      const direction = p5.Vector.add(
        p5.Vector.add(
          p5.Vector.mult(tangent1, x),
          p5.Vector.mult(tangent2, y)
        ),
        p5.Vector.mult(normal, z)
      );
      
      directions.push(direction.normalize());
    }
  }
  
  return directions;
}



