/*
Author: Project Somedays
Date: 2024-10-24
Title: Reverse-Engineering Challenge Series - The Dance

More riffing on the awesome one-tweet code by @SnowEsamosc  https://x.com/i/bookmarks?post_id=1843992881041916168

Colour palette from coolors.co: https://coolors.co/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
*/

let speaker;

const palette = "#001219, #005f73, #0a9396, #94d2bd, #e9d8a6, #ee9b00, #ca6702, #bb3e03, #ae2012, #9b2226".split(", ");

let cam;

let gui, params;
let rowSpacing, colSpacing;

function setup() {
  createCanvas(1080, 1080, WEBGL);
  noStroke();

  gui = new lil.GUI();
  params = {
    rings: 10,
    noiseZoom: 0.1,
    density: 0.5,
    rMax : width/250,
    avSphereSize: width/200,
    framesPerRotation: 30,
    sphereSize: width/100
  }

  gui.add(params, 'rings', 1, palette.length, 1);
  gui.add(params, 'density', 0, 2);
  gui.add(params, 'noiseZoom', 0.001, 1.0);
  gui.add(params, 'rMax', 0,width/10);
  gui.add(params, 'avSphereSize', width/500, width/50);
  gui.add(params, 'framesPerRotation', 10, 120, 1);
  gui.add(params, 'sphereSize', width/500, width/20);  
}

function draw() {
  background(255);
  
  // Lighting
  directionalLight(255, 255, 255, 1, -1, 0);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  for(let r = 0; r < params.rings; r++){
    let radius = (r+1)*0.5*width/params.rings;
    let ringCircumference = TWO_PI * radius;
    let numSpheres = ringCircumference * params.density / params.avSphereSize 
    let dTheta = TWO_PI/numSpheres;
    fill(palette[r]);
    for(let theta = 0; theta < TWO_PI; theta += dTheta){
      let x = radius*cos(theta);
      let y = radius*sin(theta);
      let dR = params.rMax * noise(x*params.noiseZoom, y*params.noiseZoom);
      let dA = TWO_PI * noise(x*params.noiseZoom+1000, y*params.noiseZoom+1000);
      push();
      translate(x + dR*cos(dA),y + dR*sin(dA),0);
      
      sphere(params.sphereSize * max(0, sin(r*TWO_PI/params.rings + 10*theta + (r%2 === 0 ? 1 : -1) * frameCount / params.framesPerRotation)));
      pop();
    }

  }

  // let ix = 0;
  // for(y=-width/2;y<=width/2;y+=rowSpacing){
  //   for(x=-width/2;x<=width/2;x+=colSpacing){
  //     push()
  //     translate(x,y+rowSpacing*noise(x,y),0);
  //     fill(palette[ix]);
  //     let r = max(0, rowSpacing - 0.5*abs(width/2 + params.wormLength*x - params.offset*frameCount * noise(y*params.noiseVertOffset) * params.speed%width))/2;
  //     sphere(r) ;
  //     // sphere(max(0,50-abs(2*x-5*frameCount*noise(y*0.5)*1%1e3+width)/5)/2);
  //     // sphere(max(0,50-abs(x-5*frameCount*noise(y)+250)/5)/2);
  
  //     pop();
  //   }
  //   ix = (ix + 1)%palette.length;
  // }

  orbitControl();
}



