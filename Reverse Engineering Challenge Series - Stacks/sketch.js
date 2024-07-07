  /*
  Author: Project Somedays
  Date: 2024-06-25
  Title: Into the Grinder

  Take cues from two different projects
  Ghost Friends by @KennyVaden: https://x.com/KennyVaden/status/1805105620879597834
  Yuka Aoki @yuta_0_p5: https://x.com/yuta_0_p5/status/1804898338342604974

  */

  let stackSize = 25;
  let slabThick = 10;
  const twists = 1.5;
  const n = 50;
  let ys;
  let palette = "#ffbe0b, #fb5607, #ff006e, #8338ec, #3a86ff".split(", ");
  let finalPalette;
  let autoMode = true;

  const archimedesSpiral = (a,b,t) => createVector(a*cos(t)*(t)**(1/b),a*sin(t)*(t)**(1/b));

  function setup() {
    // createCanvas(windowWidth, windowHeight, WEBGL);
    createCanvas(1080, 1080, WEBGL);
    ys = min(width, height);
    finalPalette = fillInColourPalette(palette, int(stackSize/palette.length));
    noStroke();
  }

  function draw() {
    background(0);
    pointLight(255, 255, 255, 0,0, 1.1*stackSize*slabThick*(0.5 - 0.5*cos(frameCount*TWO_PI/150)));
    // pointLight(255, 255, 255, 0.5*width*cos(frameCount*TWO_PI/60), 0.5*width*sin(frameCount*TWO_PI/60), stackSize*slabThick*0.5);
    // pointLight(255, 255, 255, 0.5*width*cos(frameCount*TWO_PI/60), 0.5*width*sin(frameCount*TWO_PI/60), 1.1*stackSize*slabThick*(0.5 + 0.5*cos(frameCount*TWO_PI/180)));

    // pointLight(255, 255, 255, 0, 0, -100);
    // pointLight(255, 255, 255, 0, 0, stackSize*slabThick*1.2);

    // ambientLight(255, 255, 255);
    
    push();
    rotateZ(frameCount*TWO_PI/300);
    for(let i = 0; i < n; i++){
      let p = archimedesSpiral(width/300,1, 2*i*TWO_PI/n);
      let offset = i*TWO_PI/n;
      push();
      translate(p.x, p.y,0);
      scale(i/n, i/n, i/n);
      showStack(offset);
      pop();
    }
    pop();
    // translate(3,3,3);
    // rotateX(PI/6);
    // for(let x = 0; x < n; x++){
    //   for(let y = 0; y < n; y++){
    //     push();
    //     translate(0.05*ys*(-n/2 + x), 0.05*ys*(-n/2 + y));
    //     let offset = map(x+y, 0, 2*n, 0, TWO_PI);
    //     showStack(offset);
    //     pop();
    //   }
    // }
    
    if(autoMode){
      orbitCamera(0.025*ys, 300, stackSize*slabThick*1.3);
    } else{
      orbitControl();
    }
    
    
    
  }

  function orbitCamera(orbitRadius, orbitRate, camHeight){
    let camX = orbitRadius * cos(frameCount * TWO_PI/orbitRate);
    let camY = orbitRadius * sin(frameCount * TWO_PI/orbitRate);
    // let camZ = orbitRadius * sin(frameCount * TWO_PI/orbitRate);
    let camZ = camHeight;
    camera(camX, camY, camZ, 0, 0, 0);
    pointLight(255, 255, 255, camX, camY, camZ);
  }

  function showStack(offset){
    for(let z = 0; z < stackSize; z++){
      fill(finalPalette[z%finalPalette.length]); // just in case it wraps around
      push();
      rotate((z+frameCount/5 + offset)*twists*TWO_PI/stackSize);
      translate(0, 0, z*slabThick);
      box(ys/25, ys/50, slabThick);
      pop();
    }
  }


  function fillInColourPalette(palette, subdivisions){
    let newPalette = [];
    let oldPalette = palette.map(e => color(e));
    for(let i = 0; i < oldPalette.length; i++){
      for(let subdiv = 0; subdiv < subdivisions; subdiv ++){
        let colourA = oldPalette[i];
        let colourB = oldPalette[(i+1)%palette.length];
        let newCol = lerpColor(colourA, colourB, subdiv/subdivisions);
        newPalette.push(newCol);
      }
    }
    return newPalette;
  }

  function keyPressed(){
    switch(key.toLowerCase()){
      case 'm':
        autoMode = !autoMode;
        break;
      default:
        return;
    }
  }




