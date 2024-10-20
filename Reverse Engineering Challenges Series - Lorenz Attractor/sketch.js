let x = 0.01;
let y = 0;
let z = 0;
let sigma = 10;
let rho = 28;
let beta = 8.0 / 3.0;
let points = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB);
}

function draw() {
  background(0);
  scale(5);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  
  let dt = 0.01;
  
  // Lorenz equations
  let dx = sigma * (y - x) * dt;
  let dy = (x * (rho - z) - y) * dt;
  let dz = (x * y - beta * z) * dt;
  
  x += dx;
  y += dy;
  z += dz;
  
  points.push(createVector(x, y, z));
  
  noFill();
  beginShape();
  for (let i = 0; i < points.length; i++) {
    let hu = map(i, 0, points.length, 0, 255);
    stroke(hu, 255, 255);
    vertex(points[i].x, points[i].y, points[i].z);
  }
  endShape();
  
  if (points.length > 10000) {
    points.shift(); // Remove old points to prevent memory issues
  }
}


// let params, gui;
// let p;
// let pts = [];

// function setup() {
//   createCanvas(windowWidth, windowHeight, WEBGL);
//   gui = new lil.GUI();
//   params = {
//     sigma: 10.0,
//     rho: 28.0,
//     beta: 2.667,
//     nPoints: 300,
//     x0: 0.0,
//     y0: 1.0,
//     z0: 1.05,
//     timeStep: 0.01,
//     bgColour: '#ffffff'
//   }

//   gui.addColor(params, 'bgColour');
//   gui.add(params, 'sigma', 0.001, 1);
//   gui.add(params, 'rho', 0.001, 1);
//   gui.add(params, 'beta', 0.001, 1);
//   gui.add(params, 'x0', 0, 10);
//   gui.add(params, 'y0', 0, 10);
//   gui.add(params, 'z0', 0, 10);
//   gui.add(params, 'nPoints', 100, 1000, 1);
//   gui.add(params, 'timeStep', 0.001, 0.1);

//   p = createVector(params.x0, params.y0, params.z0);
// }

// function draw() {
//   background(params.bgColour);

//   beginShape();
//   stroke(0);
//   strokeWeight(5);
//   vertex(p.x, p.y, p.z);
//   for(let i = 0; i < params.nPoints; i++){
//     let newP = getNextLorenzPoint(p, params.timeStep, params.sigma, params.rho, params.beta);
//     p.set(newP.x, newP.y, newP.z);
//     vertex(p.x, p.y, p.z);
//   }  
//   endShape();

//   orbitControl();
// }

// function getNextLorenzPoint(pt, dt, sigma, rho, beta){
//   let newX  = pt.x + sigma*(pt.y - pt.x);
//   let newY = pt.y + rho*pt.x - pt.y - pt.x*pt.z;
//   let newZ = pt.z + pt.x*pt.y - beta*pt.z;
//   return createVector(newX, newY, newZ).mult(dt);
// }

// // def lorenz(xyz, *, s=10, r=28, b=2.667):
// //     """
// //     Parameters
// //     ----------
// //     xyz : array-like, shape (3,)
// //        Point of interest in three-dimensional space.
// //     s, r, b : float
// //        Parameters defining the Lorenz attractor.

// //     Returns
// //     -------
// //     xyz_dot : array, shape (3,)
// //        Values of the Lorenz attractor's partial derivatives at *xyz*.
// //     """
// //     x, y, z = xyz
// //     x_dot = s*(y - x)
// //     y_dot = r*x - y - x*z
// //     z_dot = x*y - b*z
// //     return np.array([x_dot, y_dot, z_dot])

// // dt = 0.01
// // num_steps = 10000

// // xyzs = np.empty((num_steps + 1, 3))  # Need one more for the initial values
// // xyzs[0] = (0., 1., 1.05)  # Set initial values
// // # Step through "time", calculating the partial derivatives at the current point
// // # and using them to estimate the next point
// // for i in range(num_steps):
// //     xyzs[i + 1] = xyzs[i] + lorenz(xyzs[i]) * dt
