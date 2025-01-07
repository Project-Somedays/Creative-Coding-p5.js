/*
Author: Project Somedays
Date: 2025-01-02
Title: Genuary 2025 Day 2 - Layers upon layers upon layers

RESOURCES:
- https://pixabay.com/sound-effects/tearing-paper-70828/
- https://pixabay.com/sound-effects/tearing-paper-64001/
*/

let layerForeground;
let layerBackground;
let tearPoints = [];
let stripWidth;
const tearSpeed = 4;
const maxTears = 10;
const jaggedness = 20; // Controls how jagged the edges are
let currentPattern = 0;
let colors = {
  primary: null,
  secondary: null,
  accent: null
};
let paperTearingSound1;
let paperTearingSound2;
const patternCount = 10;
const baseSpeed = 2;
let noiseOffset = 0;


function preload(){
  paperTearingSound1 = loadSound("tearing-paper-70828.mp3");
  paperTearingSound2 = loadSound("tearing-paper-64001.mp3");
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(1080, 1080);
  stripWidth = width/maxTears;
  layerForeground = createGraphics(width, height);
  layerBackground = createGraphics(width, height);
  randomizeColors();
  drawWallpaperPattern(layerForeground);
  randomizeColors();
  currentPattern = int(random(patternCount+ 1));
  drawWallpaperPattern(layerBackground);
  background(200);
  initTearPoints();
  paperTearingSound1.loop();
  paperTearingSound2.loop();

}

function cycleLayers(){
  console.log("Cycling layers");
  layerForeground = layerBackground;
  layerBackground = createGraphics(width, height);
  randomizeColors();
  currentPattern = int(random(patternCount+1));
  drawWallpaperPattern(layerBackground);
  initTearPoints();
}





function draw() {
  background(255);
  image(layerBackground, 0, 0);
  image(layerForeground, 0, 0);
  updateTears(layerForeground);

  if(checkWallpaperRemaining(layerForeground)) cycleLayers();
}

function drawJaggedStrip(tear, wallpaperLayer) {
  wallpaperLayer.beginShape();
  
  // Left edge with jagged points
  for (let i = 0; i < 10; i++) {
    let y = (i * 20) - 100;
    let x = -tear.width/2 + tear.leftOffset[i];
    wallpaperLayer.vertex(x, y);
  }
  
  // Right edge with jagged points (going back up)
  for (let i = 9; i >= 0; i--) {
    let y = (i * 20) - 100;
    let x = tear.width/2 + tear.rightOffset[i];
    wallpaperLayer.vertex(x, y);
  }
  
  wallpaperLayer.endShape(CLOSE);
}

function updateTears(wallpaperLayer) {
  noiseOffset += 0.005;
  for (let i = 0; i < tearPoints.length; i++) {
    tear = tearPoints[i];
    // Calculate speed using Perlin noise
    let speed = map(noise(tear.noiseOffset + noiseOffset), 0, 1, baseSpeed * 0.5, baseSpeed * 1.5);
    tear.y += speed;
    
    tear.angle += random(-0.02, 0.02);
    tear.angle = constrain(tear.angle, -PI/4, PI/4);
    
    // Original edge variation
    for (let i = 0; i < tear.leftOffset.length; i++) {
      tear.leftOffset[i] += random(-0.5, 0.5);
      tear.rightOffset[i] += random(-0.5, 0.5);
      tear.leftOffset[i] = constrain(tear.leftOffset[i], -jaggedness, jaggedness);
      tear.rightOffset[i] = constrain(tear.rightOffset[i], -jaggedness, jaggedness);
    }
    
    wallpaperLayer.push();
    wallpaperLayer.translate(tear.x, tear.y);
    wallpaperLayer.rotate(tear.angle);
    
    wallpaperLayer.erase();
    wallpaperLayer.noStroke();
    drawJaggedStrip(tear, layerForeground);
    wallpaperLayer.noErase();
    
    wallpaperLayer.pop();
    
    if (tear.y > height) {
      tear.y = 0;
      tear.x = i * width/(maxTears-1);
      tear.angle = random(-PI/6, PI/6);
      tear.width = random(stripWidth - 10, stripWidth + 10);
      tear.leftOffset = Array(10).fill(0).map(() => random(-jaggedness, jaggedness));
      tear.rightOffset = Array(10).fill(0).map(() => random(-jaggedness, jaggedness));
    }
  }
  wallpaperLayer.push();
    wallpaperLayer.translate(tear.x, tear.y);
    wallpaperLayer.rotate(tear.angle);
    
    wallpaperLayer.erase();
    wallpaperLayer.noStroke();
    drawJaggedStrip(tear, layerForeground);
    wallpaperLayer.noErase();
    
    wallpaperLayer.pop();

    // Reset tear when it goes off screen
    if (tear.y > height) {
      tear.y = 0;
      tear.x = i * width/maxTears;
      tear.noiseOffsetX = random(1000);
      tear.noiseOffsetY = random(1000);
      tear.width = random(stripWidth - 10, stripWidth + 10);
    }
    }

    
    

function randomizeColors() {
  colors.primary = color(random(100, 255), random(100, 255), random(100, 255));
  colors.secondary = color(random(50, 200), random(50, 200), random(50, 200));
  colors.accent = color(random(50, 255), random(50, 255), random(50, 255));
  colors.extra = color(random(50, 255), random(50, 255), random(50, 255));
}

function initTearPoints() {
  for (let i = 0; i < maxTears; i++) {
    tearPoints[i] = {
      x: i*width/(maxTears-1),
      y: random(-height/10, -height/4),
      angle: random(-PI/6, PI/6),
      speed: random(1, tearSpeed),
      noiseOffset: random(1000), // Unique noise offset for each tear
      width: random(stripWidth - 10, stripWidth + 10),
      leftOffset: Array(10).fill(0).map(() => random(-jaggedness, jaggedness)),
      rightOffset: Array(10).fill(0).map(() => random(-jaggedness, jaggedness))
    };
  }
}

function drawWallpaperPattern(wallpaperLayer) {
  wallpaperLayer.background(colors.primary);
  
  switch(currentPattern) {
    case 0: // Original floral pattern
      for (let x = 0; x < width; x += 40) {
        for (let y = 0; y < height; y += 40) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x, y);
          wallpaperLayer.noStroke();
          wallpaperLayer.fill(colors.secondary);
          for (let i = 0; i < 6; i++) {
            wallpaperLayer.rotate(PI/3);
            wallpaperLayer.ellipse(15, 0, 10, 20);
          }
          wallpaperLayer.pop();
        }
      }
      break;
      
    case 1: // Geometric diamonds
      for (let x = 0; x < width; x += 50) {
        for (let y = 0; y < height; y += 50) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x, y);
          wallpaperLayer.noStroke();
          wallpaperLayer.fill(colors.secondary);
          wallpaperLayer.quad(25, 0, 50, 25, 25, 50, 0, 25);
          wallpaperLayer.fill(colors.accent);
          wallpaperLayer.quad(20, 5, 45, 25, 20, 45, 5, 25);
          wallpaperLayer.pop();
        }
      }
      break;
      
    case 2: // Art deco waves
      for (let y = 0; y < height; y += 30) {
        wallpaperLayer.noFill();
        wallpaperLayer.strokeWeight(3);
        wallpaperLayer.stroke(colors.secondary);
        let offset = (y % 60) * 0.5;
        beginShape();
        for (let x = -50; x < width + 50; x += 50) {
          wallpaperLayer.curveVertex(x + offset, y + sin(x * 0.1) * 10);
        }
        wallpaperLayer.endShape();
      }
      break;
      
    case 3: // Polka dots with rings
      for (let x = 0; x < width; x += 40) {
        for (let y = 0; y < height; y += 40) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x + 20, y + 20);
          wallpaperLayer.noStroke();
          wallpaperLayer.fill(colors.secondary);
          wallpaperLayer.circle(0, 0, 30);
          wallpaperLayer.fill(colors.accent);
          wallpaperLayer.circle(0, 0, 20);
          wallpaperLayer.fill(colors.primary);
          wallpaperLayer.circle(0, 0, 10);
          wallpaperLayer.pop();
        }
      }
      break;
      
    case 4: // Damask-style pattern
      for (let x = 0; x < width; x += 80) {
        for (let y = 0; y < height; y += 100) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x + 40, y + 50);
          wallpaperLayer.noStroke();
          wallpaperLayer.fill(colors.secondary);
          // Draw stylized fleur-de-lis
          wallpaperLayer.ellipse(0, -20, 40, 60);
          wallpaperLayer.ellipse(-15, 0, 20, 40);
          wallpaperLayer.ellipse(15, 0, 20, 40);
          wallpaperLayer.fill(colors.accent);
          wallpaperLayer.ellipse(0, 20, 30, 30);
          wallpaperLayer.pop();
        }
      }
      break;
      
    case 5: // Chevron pattern
      for (let y = 0; y < height; y += 40) {
        for (let x = -40; x < width + 40; x += 40) {
          wallpaperLayer.push();
          wallpaperLayer.noStroke();
          wallpaperLayer.fill(colors.secondary);
          wallpaperLayer.triangle(x, y, x + 20, y + 40, x + 40, y);
          wallpaperLayer.fill(colors.accent);
          wallpaperLayer.triangle(x + 5, y + 5, x + 20, y + 35, x + 35, y + 5);
          wallpaperLayer.pop();
        }
      }
      break;

      case 6: // Moroccan tiles
      for (let x = 0; x < width; x += 60) {
        for (let y = 0; y < height; y += 60) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x + 30, y + 30);
          
          // Main tile shape
          wallpaperLayer.fill(colors.secondary);
          for (let i = 0; i < 8; i++) {
            wallpaperLayer.rotate(PI/4);
            wallpaperLayer.noStroke();
            wallpaperLayer.ellipse(20, 0, 30, 10);
          }
          
          // Center decoration
          wallpaperLayer.fill(colors.accent);
          wallpaperLayer.circle(0, 0, 20);
          wallpaperLayer.fill(colors.extra);
          wallpaperLayer.circle(0, 0, 10);
          
          wallpaperLayer.pop();
        }
      }
      break;
      
    case 7: // Art nouveau swirls
      for (let x = 0; x < width; x += 100) {
        for (let y = 0; y < height; y += 100) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x + 50, y + 50);
          
          wallpaperLayer.noFill();
          wallpaperLayer.strokeWeight(3);
          wallpaperLayer.stroke(colors.secondary);
          
          // Draw spiral swirls
          for (let angle = 0; angle < TWO_PI; angle += PI/2) {
            wallpaperLayer.push();
            wallpaperLayer.rotate(angle);
            let r = 0;
            wallpaperLayer.beginShape();
            for (let a = 0; a < TWO_PI; a += 0.1) {
              r += 0.5;
              let x = cos(a) * r;
              let y = sin(a) * r;
              wallpaperLayer.curveVertex(x, y);
            }
            wallpaperLayer.endShape();
            wallpaperLayer.pop();
          }
          
          // Center accent
          wallpaperLayer.fill(colors.accent);
          wallpaperLayer.noStroke();
          wallpaperLayer.circle(0, 0, 15);
          
          wallpaperLayer.pop();
        }
      }
      break;
      
    case 8: // Japanese-inspired clouds
      for (let y = 0; y < height; y += 60) {
        for (let x = 0; x < width; x += 60) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x, y);
          
          wallpaperLayer.noStroke();
          wallpaperLayer.fill(colors.secondary);
          
          // Draw cloud pattern
          wallpaperLayer.beginShape();
          for (let angle = 0; angle < TWO_PI; angle += PI/8) {
            let r = 20 + sin(angle * 2) * 5;
            let cx = cos(angle) * r;
            let cy = sin(angle) * r;
            wallpaperLayer.curveVertex(cx + 30, cy + 30);
          }
          wallpaperLayer.endShape(CLOSE);
          
          // Inner detail
          wallpaperLayer.fill(colors.accent);
          wallpaperLayer.circle(30, 30, 20);
          
          wallpaperLayer.pop();
        }
      }
      break;
      
    case 9: // Celtic knots
      for (let x = 0; x < width; x += 80) {
        for (let y = 0; y < height; y += 80) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x + 40, y + 40);
          
          wallpaperLayer.strokeWeight(4);
          wallpaperLayer.stroke(colors.secondary);
          wallpaperLayer.noFill();
          
          // Draw interlaced pattern
          for (let i = 0; i < 4; i++) {
            wallpaperLayer.rotate(PI/2);
            wallpaperLayer.beginShape();
            wallpaperLayer.vertex(-20, -20);
            wallpaperLayer.bezierVertex(-20, 0, 0, 0, 0, -20);
            wallpaperLayer.endShape();
            
            wallpaperLayer.stroke(colors.accent);
            wallpaperLayer.beginShape();
            wallpaperLayer.vertex(-15, -15);
            wallpaperLayer.bezierVertex(-15, -5, -5, -5, -5, -15);
            wallpaperLayer.endShape();
          }
          
          wallpaperLayer.pop();
        }
      }
      break;
      
    case 10: // Victorian medallions
      for (let x = 0; x < width; x += 100) {
        for (let y = 0; y < height; y += 100) {
          wallpaperLayer.push();
          wallpaperLayer.translate(x + 50, y + 50);
          
          // Outer medallion
          wallpaperLayer.noStroke();
          wallpaperLayer.fill(colors.secondary);
          for (let i = 0; i < 12; i++) {
            wallpaperLayer.rotate(PI/6);
            wallpaperLayer.ellipse(30, 0, 60, 15);
          }
          
          // Middle layer
          wallpaperLayer.fill(colors.accent);
          for (let i = 0; i < 8; i++) {
            wallpaperLayer.rotate(PI/4);
            wallpaperLayer.ellipse(20, 0, 40, 10);
          }
          
          // Center decoration
          wallpaperLayer.fill(colors.extra);
          wallpaperLayer.circle(0, 0, 25);
          wallpaperLayer.fill(colors.primary);
          wallpaperLayer.circle(0, 0, 15);
          
          wallpaperLayer.pop();
        }
      }
      break;
  }
}

// Space key to change patterns
function keyPressed() {
  if (key === ' ') {
    currentPattern = (currentPattern + 1) % 6;
    randomizeColors();
    drawWallpaperPattern();
  }
}

function checkWallpaperRemaining(wallpaperLayer) {
  // Load pixels for analysis
  wallpaperLayer.loadPixels();
  let totalPixels = wallpaperLayer.pixels.length;
  let emptyPixels = 0;
  
  // Check every 4th value (alpha channel) in the pixels array
  for (let i = 3; i < totalPixels; i += 4) {
    if (wallpaperLayer.pixels[i] === 0) {
      emptyPixels++;
    }
  }
  
  // Calculate percentage remaining
  percentageRemaining = 100 - (emptyPixels / (totalPixels/4) * 100);
  
  // Return true if almost completely empty (allowing for some margin of error)
  return percentageRemaining < 0.1;
}