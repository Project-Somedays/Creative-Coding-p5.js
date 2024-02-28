// Made for 'Arc 🏹 #WCCChallenge'

// Hello Raph and chat. Happy Holidays! 🎄
// With this sketch I tried to make it as clean as possible
// previous sketches have been lacking of comments..
// feedback welcome :)
// click for no fill mode




// constant variables
// try playing around with these
let MAX_COUNT = 1000
let dt = 0.01
let dt0 = 0.01
let dt1 = 0.01
let moveStep = 0.01

// sliders
let sliderMaxCount
let sliderdt
let sliderdt0
let sliderdt1
let slidermovestep
let showSliders = false;
let sliderWidth = 500;


const maxPropOfScreen = 0.5;


// Declare and Initialize variables "should minimize these"
let a = 0											// angle
let h = 0											// hue
let da = 0										// change of angle
let t = 0											// timer 1
let l = 0											// length
let t0 = 0										// timer 2
let t1 = 0										// timer 3
let arcs = []									// list of arcs
let rad = 0.25								// radians or arc length

// used to keep track of previous position
let p
let px
let py

// Positional noise
let yOff;
let xOff;

function setup() {
	//set up canvas
	// createCanvas(windowWidth, windowHeight)
  createCanvas(1920, 1080, P2D);
  pixelDensity(1);
	textAlign(LEFT, TOP);
	
	// init sliders
	//																text, 				x, 												y, 	defaultVal, step, min, 	max, 	size
	sliderMaxCount = new customSlider("Max Count",	width/2 - sliderWidth/2,	20,		1000,				0,	500,		2000,	sliderWidth); 
	sliderdt = new customSlider(			"dt",					width/2 - sliderWidth/2,	40,		0.01,				0,	0.001,	0.1,	sliderWidth);
	sliderdt0 = new customSlider(			"dt0",				width/2 - sliderWidth/2,	60,		0.01,				0,	0.001,	0.1,	sliderWidth);
	sliderdt1 = new customSlider(			"dt1",				width/2 - sliderWidth/2,	80,		0.01,				0,	0.001,	0.1,	sliderWidth);
	slidermovestep = new customSlider("Move Step",	width/2 - sliderWidth/2,	100,	0.01,				0,	0.001,	0.1,	sliderWidth);
	
	yOff = random(1000);
	xOff = random(1000);
	background(23)
	let x = map(noise(xOff),0,1,0,width);
	let y = map(noise(yOff),0,1,0,height);
	p = createVector(x,y);
	px = x
	py = y

	//Set variables
	setAll()
	//time variable for noise functions
	t = random(1000) 
	t0 = random(1000)
	t1 = random(1000)
}

function draw() {
	//Set the background color using RGB then use HSB
	colorMode(RGB)
	background(23)
	colorMode(HSB)
	
	// show the sliders (depends on showSliders)
	sliderMaxCount.show();
	sliderdt.show();
	sliderdt0.show();
	sliderdt1.show();
	slidermovestep.show();
	
	let MAX_COUNT = sliderMaxCount.getVal();
	let dt = sliderdt.getVal();
	let dt0 = sliderdt1.getVal();
	let dt1 = sliderdt1.getVal();
	let moveStep = slidermovestep.getVal();
	
	
	
	xOff += moveStep
	yOff += moveStep
	let x = map(noise(xOff),0,1,0,width);
	let y = map(noise(yOff),0,1,0,height);
	p.set(x,y)
	//custom function using mouse position and the previous mouse position. adds arcs to array
	// myArc(mouseX,mouseY,pmouseX,pmouseY)
	myArc(p.x, p.y, px, py);
	px = p.x
	py = p.y
	
	
	// draw the arcs in the array
	for(let i = arcs.length-1; i>=0; i--){
		arcs[i].show(map(i,arcs.length-1,0,0,0.5))
	}
	
	// remove arcs outside of MAX_COUNT
	for(let i = 0; i < arcs.length - MAX_COUNT; i++){
		arcs.pop()
	}
}

//Custom function for drawing arcs
function myArc(x,y,xPrev,yPrev){
	// Previous position
	let v0 = createVector(xPrev,yPrev)

	// Current position
	let v1 = createVector(x,y)
	
	// Get the distance between the previous and current position
	let d = int(dist(v0.x,v0.y,v1.x,v1.y))
	
	
	if(d!=0){
		//If distance is not 0, loop through points between v0, v1
		for(let i = 0; i <= d; i++){
			//get the nth vector in line
			let v2 = p5.Vector.lerp(v0, v1, i/d)
			
			//Add the new arc to the arcs list
			arcs.unshift(new Arch(v2.x,v2.y,l,a,a+rad,h))
			
			//update variables
			setAll()
		}
	}else{
		//add arc
		arcs.unshift(new Arch(x,y,l,a,a+rad,h))
		
		//update variables
		setAll()
	}
}

//Functions to update variables
function setAll(){
	//update hue
	h = (h+0.5)%360
	setA()
	setL()
	setRad()
	setDa()
}

// Update angle
function setA(){
	a += da
}

//update length
function setL(){
	t0 += dt0
	l = map(noise(t0),0,1,0,maxPropOfScreen*min(width,height));
}

//update radians length of arc
function setRad(){
	t1 += dt1
	rad = map(noise(t1),0,1,0,PI)
}

//update the change of the angle
function setDa(){
	t+=dt
	da = map(noise(t),0,1,-0.1,0.1)
}

function keyPressed(){
	
	if(key === 'd' || key === 'D'){ // toggle debugMode/showSliders
		showSliders = !showSliders;
	}
}