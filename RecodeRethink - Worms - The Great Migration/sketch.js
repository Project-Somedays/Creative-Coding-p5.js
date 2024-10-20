/*
Author: Project Somedays
Date: 2024-10-24
Title: Reverse-Engineering Challenge Series - Worm Race

Riffing on the awesome one-tweet code by @SnowEsamosc  https://x.com/i/bookmarks?post_id=1843992881041916168

Colour palette from coolors.co: https://coolors.co/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
*/

let speaker;

const palette = "#001219, #005f73, #0a9396, #94d2bd, #e9d8a6, #ee9b00, #ca6702, #bb3e03, #ae2012, #9b2226".split(", ");

let cam;

let gui, params;
let rowSpacing, colSpacing;

function preload(){
  speaker = new p5.Speech();

}

function setup() {
  createCanvas(1080, 1080, WEBGL);
  noStroke();

  gui = new lil.GUI();
  params = {
    rows: 20,
    cols: 100,
    offset: 0.75,
    speed: 5,
    wormLength: 0.5,
    noiseVertOffset: 1.0,
  }

  gui.add(params, 'rows', 5, 50, 1).onChange(value => rowSpacing = height/value);
  gui.add(params, 'cols', 5, 100, 1).onChange(value => colSpacing = width/value);
  gui.add(params, 'offset', 0.1, 2.0);
  gui.add(params, 'speed', 1, 10);
  gui.add(params, 'wormLength', 0.0, 1.0);
  gui.add(params, 'noiseVertOffset', 0.0, 5.0);

  
  rowSpacing = height/params.rows;
  colSpacing = width/params.cols;

  
  // let voices = speaker.voices;
  // speaker.setVoice(voices[6].name);
  // speaker.setPitch(0.66);
  // speaker.speak("Behold... the great migration");
  
}

function draw() {
  background(255);
  
  // Lighting
  directionalLight(255, 255, 255, 1, -1, 0);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  
  let ix = 0;
  for(y=-width/2;y<=width/2;y+=rowSpacing){
    for(x=-width/2;x<=width/2;x+=colSpacing){
      push()
      translate(x,y+rowSpacing*noise(x,y),0);
      fill(palette[ix]);
      let r = max(0, rowSpacing - 0.5*abs(width/2 + params.wormLength*x - params.offset*frameCount * noise(y*params.noiseVertOffset) * params.speed%width))/2;
      sphere(r) ;
      // sphere(max(0,50-abs(2*x-5*frameCount*noise(y*0.5)*1%1e3+width)/5)/2);
      // sphere(max(0,50-abs(x-5*frameCount*noise(y)+250)/5)/2);
  
      pop();
    }
    ix = (ix + 1)%palette.length;
  }

  orbitControl();
}



