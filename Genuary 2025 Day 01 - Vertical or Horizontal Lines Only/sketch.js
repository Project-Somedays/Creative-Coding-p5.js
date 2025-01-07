/*
Author: Project Somedays
Date: 2025-01-01
Title: Genuary 2025 Day 1 - Vertical or Horizontal Lines Only

My mate Claude.ai worked together on this one. I like the texture.
They're totally just lines though. Really thick, blotchy lines.
Might come back later and put in various colour palette options.
*/


let brushes = [];
const numBrushes = 30;
const strokeAlpha = 1;
const baseSpeed = 5;
const verticalVariation = 0.4;  
let pg; // Single shared graphics buffer

function setup() {
  // createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  createCanvas(1080, 1080);
  background(250);
  colorMode(HSB, 360, 100, 100, 100);
  
  // Create single graphics buffer
  pg = createGraphics(width, height);
  pg.colorMode(HSB, 360, 100, 100, 100);
  pg.noStroke();
  
  for (let i = 0; i < numBrushes; i++) {
    brushes.push({
      x: random(-width * 0.5),
      y: random(height),
      size: random(height/50, height/25),
      hue: random(180, 220),
      verticalOffset: random(TWO_PI),
      speed: random(baseSpeed * 0.8, baseSpeed * 1.2)
    });
  }
}

function draw() {
  // Clear the graphics buffer each frame
  pg.clear();
  
  brushes.forEach(brush => {
    // Draw the brush strokes into the buffer
    for (let i = 0; i < 5; i++) {
      let offsetX = random(-5, 5);
      let offsetY = random(-5, 5);
      let size = brush.size + random(-10, 10);
      
      // Main color
      pg.fill(
        brush.hue + random(-10, 10),
        70 + random(-10, 10),
        90 + random(-10, 10),
        strokeAlpha
      );
      
      // Draw main blob with multiple overlapping circles for texture
      for (let j = 0; j < 3; j++) {
        let layerOffset = random(-size/4, size/4);
        pg.circle(
          brush.x + offsetX + layerOffset, 
          brush.y + offsetY + layerOffset, 
          size * random(0.8, 1.2)
        );
      }
      
      // Add water spread effect
      for (let j = 0; j < 5; j++) {
        let spreadX = brush.x + random(-size, size);
        let spreadY = brush.y + random(-size, size);
        let spreadSize = size * random(0.1, 0.3);
        pg.circle(spreadX, spreadY, spreadSize);
      }
    }
    
    // Blend the buffer onto the main canvas
    blendMode(MULTIPLY);
    image(pg, 0, 0);
    blendMode(SOFT_LIGHT);
    image(pg, 0, 0);
    blendMode(SCREEN);
    image(pg, 0, 0);
    
    // Update brush position
    brush.x += brush.speed;
    brush.y += sin(frameCount * 0.02 + brush.verticalOffset) * verticalVariation;
    brush.y = constrain(brush.y, 0, height);
    
    // Reset to left side when reaching right edge
    if (brush.x > width) {
      brush.x = 0;
      brush.y = random(height);
      brush.verticalOffset = random(TWO_PI);
    }
  });
}
// function draw() {
//   noStroke();
  
//   brushes.forEach(brush => {
//     // Create multiple overlapping circles for each brush
//     for (let i = 0; i < 5; i++) {
//       let offsetX = random(-5, 5);
//       let offsetY = random(-5, 5);
//       let size = brush.size + random(-10, 10);
      
//       // Vary the color slightly
//       fill(
//         brush.hue + random(-10, 10),
//         70 + random(-10, 10),
//         90 + random(-10, 10),
//         strokeAlpha
//       );
      
//       // Draw main blob
//       circle(brush.x + offsetX, brush.y + offsetY, size);
      
//       // Add some smaller circles around for texture
//       for (let j = 0; j < 3; j++) {
//         let splatterX = brush.x + random(-size/2, size/2);
//         let splatterY = brush.y + random(-size/2, size/2);
//         let splatterSize = size * random(0.1, 0.3);
//         circle(splatterX, splatterY, splatterSize);
//       }
//     }
    
//     // Update brush position
//     // Constant horizontal movement
//     brush.x += brush.speed;
    
//     // Subtle sine wave vertical movement
//     brush.y += sin(frameCount * 0.02 + brush.verticalOffset) * verticalVariation;
    
//     // Keep vertical position within canvas
//     brush.y = constrain(brush.y, 0, height);
    
//     // Reset to left side when reaching right edge
//     if (brush.x > width) {
//       brush.x = 0;
//       brush.y = random(height);
//       brush.verticalOffset = random(TWO_PI);
//     }
//   });
// }

// function mousePressed() {
//   // Add a new brush at mouse position when clicked
//   brushes.push({
//     x: mouseX,
//     y: mouseY,
//     size: random(20, 50),
//     hue: random(180, 240),
//     speed: random(baseSpeed * 0.8, baseSpeed * 1.2),
//     verticalOffset: random(TWO_PI)
//   });
// }