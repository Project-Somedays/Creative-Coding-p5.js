const interferenceShader = `
#ifdef GL_ES
precision mediump float;
#endif

const int MAX_CONTROLPOINTS = 15;
varying vec2 vTexCoord;
uniform vec2 uResolution;
uniform int uControlPointCount;
// uniform vec2 uControlPoints[MAX_CONTROLPOINTS];
uniform vec2 uCpt1;
uniform vec2 uCpt2;
uniform vec2 uCpt3;
uniform vec2 uCpt4;
uniform vec2 uCpt5;
uniform float uMaxDist;
uniform float uCycles;
float PI = 3.1415926535;

void main() {
  vec2 st = gl_FragCoord.st/uResolution;
  vec2 coord = st*uResolution - uResolution / 2.0;

  float brightness = 0.0;
//   for (int i = 0; i < uControlPointCount; i++) {
//     // vec2 point = vec2(uControlPoints[i].x, uControlPoints[i].y);
//     float dist = distance(coord, uControlPoints[i])/uMaxDist; // normalize
//     brightness += sin(uCycles*dist*2.0*PI;
//   }
  brightness += sin(uCycles*2.0*PI*distance(coord, uCpt1)/uMaxDist);
  brightness += sin(uCycles*2.0*PI*distance(coord, uCpt2)/uMaxDist);
  brightness += sin(uCycles*2.0*PI*distance(coord, uCpt3)/uMaxDist);
  brightness += sin(uCycles*2.0*PI*distance(coord, uCpt4)/uMaxDist);
  brightness += sin(uCycles*2.0*PI*distance(coord, uCpt5)/uMaxDist);
  
  gl_FragColor = vec4(1.0 - vec3(abs(brightness)), 1.0);
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  
}`;
