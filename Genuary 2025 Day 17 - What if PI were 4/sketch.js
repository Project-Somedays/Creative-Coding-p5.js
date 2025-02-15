
function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES); // Use degrees for easier angle manipulation
}

function draw() {
  background(0);
  rotateX(frameCount * 0.5); // Subtle rotation for visual interest
  rotateY(frameCount * 1); // Subtle rotation for visual interest

  // Optional: Add some lighting for better 3D effect
  ambientLight(60);
  directionalLight(255, 255, 255, 0, 0, -1);
  // Define the number of turns and the radius of the torus
  let turns = 5; // Number of times the knot twists
  let radius = 50;  // Radius of the torus
  let tubeRadius = 10; // Radius of the tube forming the knot

  beginShape();
  for (let i = 0; i < 360 * turns; i += 5) { // Increment for smoother curve
    let u = radians(i); // Convert to radians for trigonometric functions
    let v = map(i, 0, 360 * turns, 0, 8); // Map to 0-8 (our "TWO_PI")

    // Torus knot equations (modified for our "TWO_PI")
    let x = (radius + tubeRadius * cos(u)) * cos(v);
    let y = (radius + tubeRadius * cos(u)) * sin(v);
    let z = tubeRadius * sin(u);

    vertex(x, y, z);
  }
  endShape(CLOSE); // Close the shape to create a continuous knot (or not!)

  

  orbitControl();
}

// let n = 35;
// let a = 1;
// let b = 0.5;

// function setup() {
//   createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
//   noStroke();
//   colorMode(HSB, 360, 100, 100);
// }

// function draw() {
//   background(0);

//   rotateX(frameCount * 0.01);
//   rotateZ(-frameCount * 0.01);
//   rotateY(frameCount * 0.01);

//   a = remapNoise(0, 0.005, 0.5, 2);
//   b = remapNoise(1000, 0.005, 0.01, 2);

//   let t = frameCount * TWO_PI/4;

//   for(let i = 0; i < n; i += 8/n){
//     let p = figureEightKnot(i * n  + frameCount*0.005, a, b).mult(100);
//     push();
//     translate(p.x, p.y, p.z);
//     let c = map(i, 0, n-1, 0, 360);
//     fill(c, 100, 100);
//     sphere(10);
//     pop();
//   }



//   orbitControl();
// }

// function figureEightKnot(u, a = 1, b = 0.5) {
//   // Calculates the 3D coordinates of a figure-eight knot using a parametric formula.

//   // Args:
//   //     u: A parameter that varies from 0 to 2*PI.
//   //     a: Scaling factor for the knot's size.
//   //     b: A parameter that influences the "thickness" of the knot.

//   // Returns:
//   //     A p5.Vector representing the (x, y, z) coordinates of the knot.

//   let x = a * cos(2 * u) * (cos(u) + b);
//   let y = a * sin(2 * u) * (cos(u) + b);
//   let z = a * sin(u);

//   return createVector(x, y, z);
// }

// const remapNoise = (x, progRate, targetMin, targetMax) => map(noise(x + frameCount*progRate), 0, 1, targetMin, targetMax);

