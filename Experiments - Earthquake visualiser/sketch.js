let cols = 50; // Number of segments around the circumference
let rows = 25;  // Number of segments along the height
let radius = 100;  // Base radius of the cylinder
let height = 300;  // Height of the cylinder
let noiseScale = 0.1; // Scale for Perlin noise
let noiseProg = 0.05;

let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fill(255);
  // strokeWeight(1);
  // noFill();
  // stroke(255);

  for(let col = 0; col < cols; col++){
    let newCol = [];
    let theta = map(col, 0, cols, 0, TWO_PI);
    for(let row = 0; row < rows; row++){
      let x = radius*cos(theta);
      let z = radius*sin(theta);
      let y = -height/2 + row*height/rows;
      newCol.push(createVector(x,y,z))
    }
    grid.push(newCol)
  }

}

function draw() {
  background(0);

  let a = frameCount * TWO_PI/120;
  pointLight(255, 255, 255, 1.5*radius*cos(a), 0, 1.5*radius*sin(a));
  
  
  // Rotate the cylinder for better visualization
  // rotateY(millis() * 0.001);
  // rotateX(PI / 6);

  // Custom cylinder generation with Perlin noise
  beginShape(TRIANGLE_STRIP)
    for(let col = 0; col < cols + 1; col++){
      for(let row = 0; row < rows; row++){
        let x = grid[col%cols][row].x;
        let y = grid[col%cols][row].y;
        let z = grid[col%cols][row].z
        let nextX = grid[(col + 1)%cols][row].x;
        let nextY = grid[(col + 1)%cols][row].y;
        let nextZ = grid[(col + 1)%cols][row].z;
        let theta = map(col, 0, cols, 0, TWO_PI);
        let rOff = map(noise(x*noiseScale, y*noiseScale + frameCount * noiseProg, z*noiseScale), 0, 1, -radius/2, radius/2);
        let pertX = rOff*cos(theta);
        let pertZ = rOff*sin(theta);
        let rNextOff = map(noise(nextX*noiseScale, nextZ*noiseScale + frameCount * noiseProg, z*noiseScale), 0, 1, -radius/2, radius/2);
        let pertNextX = rNextOff*cos(theta);
        let pertNextZ = rNextOff*sin(theta);
        vertex(x + pertX, y ,z + pertZ);
        vertex(nextX + pertNextX, nextY, nextZ + pertNextZ);
      }
    }
  
  endShape();

  orbitControl();
}

function chatGPTDrawCylinder(){
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < cols; i++) {
    let theta = map(i, 0, cols, 0, TWO_PI); // Angle around the cylinder
    
    for (let j = 0; j <= rows; j++) {
      let y = map(j, 0, rows, -height / 2, height / 2); // Y-coordinate along the height
      
      // Use Perlin noise to modulate the radius and vertical distortion
      let noiseFactor = noise(i * noiseScale, j * noiseScale);
      // let r = radius + map(noiseFactor, 0, 1, -30, 30); // Vary the radius
      // let offsetY = map(noiseFactor, 0, 1, -5, 5); // Add slight vertical variation
      let offsetY = 0;
      let r = radius;

      // Calculate the x, z coordinates around the circumference
      let x = r * cos(theta);
      let z = r * sin(theta);

      // Draw two vertices per row to create triangle strip
      vertex(x, y + offsetY, z); // First row

      // Connect to the next row of the strip (next iteration of i)
      let nextTheta = map(i + 1, 0, cols, 0, TWO_PI);
      let nextR = radius + map(noise((i + 1) * noiseScale, j * noiseScale), 0, 1, -30, 30);
      let nextX = nextR * cos(nextTheta);
      let nextZ = nextR * sin(nextTheta);
      
      vertex(nextX, y + offsetY, nextZ); // Second row, next column
    }
  }
  endShape(CLOSE);
}