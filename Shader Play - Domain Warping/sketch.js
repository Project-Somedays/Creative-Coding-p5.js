let shaderProgram;

function preload() {
  shaderProgram = createShader(shaderVert, shaderFrag);
}

function setup() {
  createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
  noStroke();

}

function draw() {
  background(0);
  
  frameRate(60);
  shader(shaderProgram);
  
  // Draw a rectangle to cover the entire canvas
  beginShape();
  vertex(-1, -1, 0, 0, 0);  // Bottom-left corner
  vertex(1, -1, 0, 1, 0);   // Bottom-right corner
  vertex(1, 1, 0, 1, 1);    // Top-right corner
  vertex(-1, 1, 0, 0, 1);   // Top-left corner
  endShape(CLOSE);   // Top-left
}

const shaderVert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);
  gl_Position = vec4(aPosition, 1.0);
}
`

const shaderFrag = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
float PI = 3.141526535;

void main() {
  // float x = sin(sin(vTexCoord.x + 0.125)*2*PI + 0.125);
  // float y = sin(sin(vTexCoord.y + 0.125)*2*PI + 0.125);
  float x = vTexCoord.x;
  float y = vTexCoord.y;
  vec4 pixelColour = vec4(x,y,x+y,1.0);
    
  gl_FragColor = pixelColour;
}
`
