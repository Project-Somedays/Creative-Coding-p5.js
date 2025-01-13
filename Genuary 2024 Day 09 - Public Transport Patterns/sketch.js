
let chair;
let pattern; 
let road;
let currentPalette;
let currentPatternMethod;

let palettes = [
  "#26547c, #ef476f, #ffd166".split(", "),
  "#264653, #2a9d8f, #e9c46a".split(", "),
  "#f72585, #7209b7, #3a0ca3".split(", "),
  "#fb8b24, #d90368, #820263".split(", "),
  "#fe4a49, #fed766, #009fb7".split(", "),
  "#ef767a, #456990, #49beaa".split(", "),
  "#f18f01, #048ba8, #2e4057".split(", "),
  "#d00000, #ffba08, #3f88c5".split(", ")
]

function preload(){
  chair = loadModel("chairs.obj", true, () => console.log("Chair model loaded"));
}

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  createCanvas(1080, 1080, WEBGL);
  let currentPalette = random(palettes);
  console.log(currentPalette);
  currentPatternMethod = getRandomPattern()
  pattern = createGraphics(1080, 1080);
  currentPatternMethod(pattern, currentPalette);
  // pattern.stroke(currentPalette[0]);
  // pattern.strokeWeight(2);
  // pattern.background(currentPalette[1]);
  noStroke();
  

  // for(let i = 0; i < 3000; i++){
  //   pattern.push();
  //   pattern.translate(random(pattern.width), random(pattern.height));
  //   pattern.rotate(random(TWO_PI));
  //   pattern.line(-5, -5, 5, 5);
  //   pattern.pop();
  // }

  road = createGraphics(width, height*4);
  road.rectMode(CENTER);
  road.noStroke();
  
  
}

function draw() {
  background(0);
  background(255);

  push();
  rotateY(frameCount * TWO_PI / 1200);

  road.fill(0);
  road.rect(road.width/2, road.height/2, road.width, road.height/4);
  road.fill(255);
  for(let i = 0; i < 20; i++){
    road.rect(-road.width*0.25 + i*road.width/10 + 20*frameCount%200, road.height/2, road.width/25, road.width/100);
  }
  
  push();
  translate(0,height/6, width/6);
  rotateX(HALF_PI);
  texture(road);
  plane(road.width, road.height);
  pop();

  for(let i = 0; i < 5; i++){
    pointLight(255, 255, 255, -width + i * width/5,-height/2, 0);
  }
  

  texture(pattern);
  push();
  let yOff = map(noise(frameCount*0.1), 0, 1, -5, 5);
  let xOff = map(noise(frameCount*0.1+1000), 0, 1, -3, 3);
  let zOff = map(noise(frameCount*0.1+1000), 0, 1, -3, 3);
  translate(xOff, yOff,zOff);
  // rotateY(frameCount*TWO_PI/1200);
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 2; j++){
      let x = -width/3 + i*2*width/3/10;
      let z = -width/12 + j * width/6;
      push();
      
      translate(x,0,z);
      rotateY(-PI - HALF_PI);
      rotateX(-PI);
      // rotateX(HALF_PI);
      // normalMaterial();
      scale(0.4);
      model(chair);
      pop();
    }
    
  }
  pop();
  pop();

  orbitControl();
}


// Array of pattern generation functions that draw to a buffer
const patterns = [
  // 1. Diagonal stripes with dots
  (pg, colors) => {
    pg.background(colors[0]);
    pg.strokeWeight(15);
    pg.stroke(colors[1]);
    for (let i = -100; i < pg.width + 100; i += 30) {
      pg.line(i - pg.height/2, -100, i + pg.height/2, pg.height + 100);
    }
    pg.noStroke();
    pg.fill(colors[2]);
    for (let i = 0; i < pg.width; i += 30) {
      for (let j = 0; j < pg.height; j += 30) {
        pg.circle(i + sin(frameCount * 0.02) * 5, j, 8);
      }
    }
  },

  // 2. Honeycomb pattern
  (pg, colors) => {
    pg.background(colors[0]);
    let size = 40;
    let h = size * sqrt(3);
    pg.noStroke();
    pg.fill(colors[1]);
    for (let i = 0; i < pg.width + size; i += size * 1.5) {
      for (let j = 0; j < pg.height + h; j += h) {
        pg.beginShape();
        for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
          let px = i + cos(a) * size;
          let py = j + sin(a) * size;
          pg.vertex(px, py);
        }
        pg.endShape(CLOSE);
      }
    }
    pg.fill(colors[2]);
    for (let i = size * 0.75; i < pg.width + size; i += size * 1.5) {
      for (let j = h/2; j < pg.height + h; j += h) {
        pg.circle(i, j, size/2);
      }
    }
  },

  // 3. Wavy lines
  (pg, colors) => {
    pg.background(colors[0]);
    pg.noFill();
    pg.strokeWeight(8);
    for (let i = 0; i < pg.height; i += 20) {
      pg.stroke(colors[1]);
      pg.beginShape();
      for (let x = 0; x < pg.width + 10; x += 10) {
        let y = i + sin(x * 0.02 + frameCount * 0.02) * 10;
        pg.vertex(x, y);
      }
      pg.endShape();
      
      pg.stroke(colors[2]);
      pg.beginShape();
      for (let x = 0; x < pg.width + 10; x += 10) {
        let y = i + 10 + cos(x * 0.02 + frameCount * 0.02) * 10;
        pg.vertex(x, y);
      }
      pg.endShape();
    }
  },

  // 4. Checkerboard with circles
  (pg, colors) => {
    pg.background(colors[0]);
    let size = 50;
    pg.noStroke();
    for (let i = 0; i < pg.width; i += size) {
      for (let j = 0; j < pg.height; j += size) {
        if ((i + j) % (size * 2) === 0) {
          pg.fill(colors[1]);
          pg.rect(i, j, size, size);
          pg.fill(colors[2]);
          pg.circle(i + size/2, j + size/2, size/2);
        }
      }
    }
  },

  // 5. Crossing paths
  (pg, colors) => {
    pg.background(colors[0]);
    pg.strokeWeight(15);
    pg.stroke(colors[1]);
    for (let i = 0; i < pg.width + 100; i += 100) {
      pg.line(i, 0, i - 100, pg.height);
    }
    pg.stroke(colors[2]);
    for (let i = 0; i < pg.width + 100; i += 100) {
      pg.line(i, 0, i + 100, pg.height);
    }
  },

  // 6. Dotted grid with alternating sizes
  (pg, colors) => {
    pg.background(colors[0]);
    pg.noStroke();
    let spacing = 40;
    for (let i = 0; i < pg.width; i += spacing) {
      for (let j = 0; j < pg.height; j += spacing) {
        if ((i + j) % (spacing * 2) === 0) {
          pg.fill(colors[1]);
          pg.circle(i, j, 20);
        } else {
          pg.fill(colors[2]);
          pg.circle(i, j, 10);
        }
      }
    }
  },

  // 7. Zigzag ribbons
  (pg, colors) => {
    pg.background(colors[0]);
    pg.noFill();
    pg.strokeWeight(12);
    let amplitude = 30;
    let period = 60;
    for (let yPos = -20; yPos < pg.height + 20; yPos += 40) {
      pg.stroke(colors[1]);
      pg.beginShape();
      for (let x = -20; x < pg.width + 20; x += 5) {
        let y = yPos + sin((x + frameCount) * TWO_PI / period) * amplitude;
        pg.vertex(x, y);
      }
      pg.endShape();
      
      pg.stroke(colors[2]);
      pg.beginShape();
      for (let x = -20; x < pg.width + 20; x += 5) {
        let y = yPos + 20 + sin((x + frameCount + period/2) * TWO_PI / period) * amplitude;
        pg.vertex(x, y);
      }
      pg.endShape();
    }
  },

  // 8. Concentric shapes
  (pg, colors) => {
    pg.background(colors[0]);
    pg.noFill();
    pg.strokeWeight(8);
    for (let i = 0; i < max(pg.width, pg.height); i += 40) {
      pg.stroke(colors[1]);
      pg.rect(pg.width/2 - i/2, pg.height/2 - i/2, i, i);
      pg.stroke(colors[2]);
      pg.circle(pg.width/2, pg.height/2, i);
    }
  },

  // 9. Diamond lattice
  (pg, colors) => {
    pg.background(colors[0]);
    let size = 40;
    pg.noStroke();
    for (let i = -size; i < pg.width + size; i += size * 2) {
      for (let j = -size; j < pg.height + size; j += size * 2) {
        pg.fill(colors[1]);
        pg.quad(i, j + size, i + size, j, i + size * 2, j + size, i + size, j + size * 2);
        pg.fill(colors[2]);
        pg.circle(i + size, j + size, size/2);
      }
    }
  },

  // 10. Flowing curves
  (pg, colors) => {
    pg.background(colors[0]);
    pg.noFill();
    pg.strokeWeight(10);
    for (let i = 0; i < pg.width + 100; i += 50) {
      pg.stroke(colors[1]);
      pg.beginShape();
      for (let y = 0; y < pg.height; y += 10) {
        let x = i + sin(y * 0.02 + frameCount * 0.02) * 30;
        pg.vertex(x, y);
      }
      pg.endShape();
      
      pg.stroke(colors[2]);
      pg.beginShape();
      for (let y = 0; y < pg.height; y += 10) {
        let x = i + 25 + cos(y * 0.02 + frameCount * 0.02) * 30;
        pg.vertex(x, y);
      }
      pg.endShape();
    }
  }
];

// Helper function to get a random pattern
function getRandomPattern() {
  return patterns[floor(random(patterns.length))];
}

function doubleClicked(){
  currentPalette = random(palettes);
  currentPatternMethod = getRandomPattern();
  currentPatternMethod(pattern, currentPalette);
}