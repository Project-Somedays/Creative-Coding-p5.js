
let centralRockRadius; 
let centralRockHeight; 
let outerRocks = []
let res = 20;
let w;
const noiseDeet = 50;
let grassTexture;
let cubeTexture;

function preload(){
  grassTexture = loadImage("Grass_Block_29_JE2_BE2.webp");
  cubeTexture = loadImage("Cube Texture.png");
}

function setup() {
  createCanvas(400, 400, WEBGL);
  noStroke();

  centralRockRadius = width/6;
  centralRockHeight = width*0.8;

  w = width/res;

  for(let i = 0; i < res; i++){
    for(let j = 0; j < res; j++){
      for(let k = 0; k < res; k++){
        let x = -width/2 + i*width/res;
        let y = -width/2 + j*width/res;
        let z = -width/2 + k*width/res;
        if(dist(x,z,0,0) < centralRockRadius && y > height/2 - centralRockHeight) continue;
        let p = createVector(x,y,z)
        let offset = map(noise(x/noiseDeet, y/noiseDeet, z/noiseDeet), 0, 1, 0, height/4);
        outerRocks.push({p, offset});
        
      }
    }
  }
}



function draw() {
  background(220);

  pointLight(255, 255, 255, 0, -height, 0);
  directionalLight(255, 255, 255, 0.5, 0.5, -0.5);
  
  fill("#964B00");

  let threshold = map(mouseY, 0, height, -height/2, height/2);
  
  noStroke();
  texture(cubeTexture);
  for(let rock of outerRocks){
    if(rock.p.y < threshold + rock.offset) continue;
    push();
    translate(rock.p.x, rock.p.y, rock.p.z);
    box(w, w, w);
    pop();
  }

  showCentralRock();
  orbitControl();
}

function showCentralRock(){
  push();
  translate(0, height/2 - centralRockHeight/2, 0);
  noStroke();
  fill(0);
  cylinder(centralRockRadius, centralRockHeight, 8);
  pop();
}