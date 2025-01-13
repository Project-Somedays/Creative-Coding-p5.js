let n = 150;
let noiseScale = 150;
let knotScale;
function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  createCanvas(1080, 1080, WEBGL);
  // noStroke();
  fill(255,0 ,0 );
  knotScale = width/12;
  colorMode(HSB, 360, 100, 100);
  noCursor();
}

function draw() {
  background(0);
  // specularMaterial(255, 255, 255);
  // directionalLight(255, 255, 255, 1, 1, 1);
  // directionalLight(255, 255, 255, -1, -1, -1);
  // directionalLight(255, 255, 255, 0,0,-1);

  let a = frameCount * TWO_PI / 1200;
  rotateX(a);
  rotateY(-a);
  rotateZ(a);
  
  for(let k = 0; k < 2; k++) {
    let colOffset = k * 180;
    let colIndex = (0.5*frameCount+colOffset)%360;
   
  fill(colIndex, 100, 100);
    let angle = k*HALF_PI;
    let xOff = -width/8 + k*width/4;
    push();
    translate(xOff, 0, 0);
    rotateX(angle);
    
    for(let i = 0; i < n; i++) {
      let t = i * TWO_PI/n + frameCount * TWO_PI/2400;
      let p = cinquefoil(t, 5, 2, knotScale);
      
      // Get rotation matrix for this point
      const rotMatrix = getRotationMatrix(t, 5, 2, 25);
      
      push();
      translate(p.x, p.y, p.z);
      
      // Apply rotation matrix using p5.js's applyMatrix()
      applyMatrix(
        rotMatrix[0][0], rotMatrix[1][0], rotMatrix[2][0], 0,
        rotMatrix[0][1], rotMatrix[1][1], rotMatrix[2][1], 0,
        rotMatrix[0][2], rotMatrix[1][2], rotMatrix[2][2], 0,
        0, 0, 0, 1
      );
      
      // Now the cylinder will be oriented along the curve's tangent
      let scl = map(noise(p.x/noiseScale, p.y/noiseScale, p.z/noiseScale), 0, 1, 0.05, 3);
      scale(scl);
      cylinder(width/50, width/100, 4);
      pop();
    }
    pop();
  }

  orbitControl();
}

// Your existing cinquefoil function
const cinquefoil = (t, n, m, s) => createVector(
  cos(n*t)*(3 + cos(m*t)),
  sin(n*t)*(3 + cos(m*t)),
  sin(m*t)
).mult(s);

// Calculate derivative of the curve
const cinquefoilDerivative = (t, n, m, s) => createVector(
  (-n*sin(n*t)*(3 + cos(m*t)) + cos(n*t)*(-m*sin(m*t))),
  (n*cos(n*t)*(3 + cos(m*t)) + sin(n*t)*(-m*sin(m*t))),
  m*cos(m*t)
).mult(s);

// Get rotation matrix for a point on the curve
const getRotationMatrix = (t, n, m, s) => {
  const tangent = cinquefoilDerivative(t, n, m, s).normalize();
  
  // Use UP vector (0,0,1) as reference
  const up = createVector(0, 0, 1);
  let binormal = p5.Vector.cross(tangent, up);
  
  // If binormal is too small, use RIGHT vector instead
  if (binormal.mag() < 0.000001) {
    const right = createVector(1, 0, 0);
    binormal = p5.Vector.cross(tangent, right);
  }
  binormal.normalize();
  
  // Calculate normal
  const normalV = p5.Vector.cross(binormal, tangent);
  normalV.normalize();
  
  // Return rotation matrix
  return [
    [normalV.x, binormal.x, tangent.x],
    [normalV.y, binormal.y, tangent.y],
    [normalV.z, binormal.z, tangent.z]
  ];
};