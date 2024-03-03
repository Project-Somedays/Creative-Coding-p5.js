// Original artwork: flow by reona396 https://openprocessing.org/sketch/2049149
// making it into a perfect loop and also added global rotation

let shapes = [];
let noiseSpreadMultiplier = 2.0;
let xField, dField, sepField, tField;
let currentIndex = 0;
let span;
let globA;
let colours;
let twists;

// capture variables
let capture;
const canvasID = 'canvas'


// colours = ['#565554', '#2e86ab', '#f6f5ae', '#f5f749',' #f24236'];
const colourPalettes = [
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'],
[ '#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
['#355070', '#6d597a', '#b56576', '#e56b6f', '#eaac8b'],
['#26547c', '#ef476f', '#ffd166', '#06d6a0'],
['#05668d', '#028090', '#00a896', '#02c39a'],
['#ffbe0b', '#fb5607', '#ff006e', '#8338ec'],
['#26547c', '#ef476f', '#ffd166'],
['#edae49', '#d1495b', '#00798c'],
["#390099","#9e0059","#ff0054","#ff5400","#ffbd00"]
];

function setup() {
  let canvas = createCanvas(1080, 1920, P2D);
  twists = int(random(2,5));


  // setting up the capture
  canvas.id(canvasID);
  capture = new CCapture({
	format : 'png',
	name : 'capture'
  });

	pixelDensity(1);
  rectMode(CENTER);
	colours = random(colourPalettes);
	// angleMode(DEGREES);
	span = int(1.2*height);
	xField = getLoopValues(-width/2, width/2);
	dField = getLoopValues(0.05*width, 0.1*width);
	sepField = getLoopValues(0.05*width, 0.3*width);
	tField = getLoopValues(-2*TWO_PI, 2*TWO_PI);
	globA = 0;
	
	// to get the perfect loop, the animation needs to start pre-filled
	for(let i = 0; i < span; i++){
		shapes.push(
    new Shape(
      width / 2 + xField[currentIndex],
      1.2*height,
      dField[currentIndex],
      sepField[currentIndex],
      tField[currentIndex]
			)
		);
		stroke(0,50);

		for (let i = 0; i < shapes.length; i++) {
			shapes[i].move();
			// shapes[i].display();
		}
		
		currentIndex = (currentIndex + 1)%span;
		globA += twists*TWO_PI/span; // in one loop, it should twist a whole number of times
	}
	
	
}

function draw() {
  // background("#E7ECF2");
  console.log(frameCount);
	background(0);
  if(frameCount === 1) capture.start();
	if(frameCount > span){
		noLoop();
		capture.stop()
		capture.save();
		console.log("End of animation! Saving now...")
		return;
	}


	/*
	In the original, noise values are calculated on the fly
	*/
  // shapes.push(
  //   new Shape(
  //     width * 0.9,
  //     height / 2 + map(noise(frameCount * 0.01), 0, 1, -height / 2, height / 2),
  //     map(noise(1000 + frameCount * 0.025), 0, 1, 3, 20),
  //     map(noise(10000 + frameCount * 0.025), 0, 1, 0, 300),
  //     map(noise(100000 + frameCount * 0.01), 0, 1, -360, 360)
  //   )
  // );
	
	/*
	To get a perfect loop, 2D perlin noise values are sampled and each new shape uses the saved values from setup
	*/
	shapes.push(
    new Shape(
      width / 2 + xField[currentIndex],
      height * 1.2,
      dField[currentIndex],
      sepField[currentIndex],
      tField[currentIndex]
    )
  );

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].move();
    shapes[i].display();
  }

  for (let j = shapes.length - 1; j >= 0; j--) {
    if (shapes[j].isFinish) {
      shapes.splice(j, 1);
    }
  }
	
	currentIndex = (currentIndex + 1)%span;
	globA += 2*TWO_PI/span; // in one loop, it should twist a whole number of times
  capture.capture(document.getElementById(canvasID));
}

function getLoopValues(minVal, maxVal){
	let loopVals = [];
	for(let i = 0; i < span; i++){
		let noiseX = noiseSpreadMultiplier*(cos(i*TWO_PI/span)+1); // adding the one makes cos always positive
		let noiseY = noiseSpreadMultiplier*(sin(i*TWO_PI/span)+1);
		let rawNoise = noise(noiseX,noiseY);
		loopVals.push(map(rawNoise,0,1,minVal,maxVal));
	}
	return loopVals;
}

