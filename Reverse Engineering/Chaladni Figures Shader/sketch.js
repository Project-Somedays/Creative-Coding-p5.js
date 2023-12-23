let chaladniShader;

function preload(){
  chaladniShader = loadShader('shader.vert', 'shader.frag');
}
function setup() {
  createCanvas(1000, 1000, WEBGL);
}

function draw() {
  background(220);
  shader(chaladniShader);
  rect(0,0,width, height);
}
