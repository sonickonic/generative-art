const canvasSketch = require("canvas-sketch");
const createShader = require("canvas-sketch-util/shader");
const glsl = require("glslify");

// Setup our sketch
const settings = {
  dimensions: [512, 512],
  context: "webgl",
  animate: true,
  fps: 24,
  duration: 4,
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float playhead;
  uniform float aspect;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist = length(center);

    float alpha = smoothstep(0.255, 0.25, dist);

    float n = noise(vec3(center * 2.0, playhead));
    // vec3 color = 0.5 + 0.5 * sin(playhead + vUv.xyx + vec3(n));

    vec3 color = hsl2rgb(0.6 + n * 0.15, 0.5, 0.5);
    
    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      playhead : ({ playhead  }) => Math.sin(playhead * Math.PI) ,
      aspect: ({ width, height }) => width / height,
    },
  });
};

canvasSketch(sketch, settings);
