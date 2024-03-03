/*
Author: Project Somedays
Date: 2024-03-03
Title: WCCChallenge "Nope"

Building off a sketch by Daniel Shiffman, video: https://youtu.be/10st01Z0jxc
*/

let img;
let tentacles = [];
let xOff;
let yOff;
let nRate = 0.01;
let n = 50;
let segL;
let scl;
let segN = 7;
let eyeN = 10;
// let openEye;
// let closeEye;
let creature;
let eyeNoiseZoom = 50;


function preload(){
    img = loadImage("Offering@4x.png");
}

function setup() {
    createCanvas(720, 720, P2D);
    pos = createVector(0,0);
    xOff = random(1000);
    yOff = random(1000);
    segL = 0.33*min(width, height);
    scl = 0.1*width / img.width;

    creature = new EyeCluster(0.03*width);

    
    for (let a = 0; a < n; a ++) {
        let x = random(width);
        let y = random(height);
        tentacles.push(new Tentacle(x, y));
    }

    // openEye = createGraphics(0.1*width, 0.1*width);
    // openEye.fill(255);
    // openEye.circle(openEye.width/2, openEye.height/2, openEye.width);
    // openEye.fill(0);
    // openEye.circle(openEye.width/2, openEye.height/2, 0.3*openEye.width);

    // closeEye = createGraphics(0.1*width, 0.1*width);
    // closeEye.fill(0);
    // closeEye.circle(openEye.width/2, openEye.height/2, openEye.width);
}

function draw() {
    background(51);
    noFill();
    let x = width*noise(xOff);
    let y = height*noise(yOff);
    // creature.update(mouseX, mouseY);
    creature.update(x,y);
    

    // ellipse(width / 2, height / 2, 400, 400);
    // image(img, 0, 0, img.width*scl, img.height*scl);
    // if(random() < 0.01){
    //     image(closeEye, width/2, height/2);
    // } else{
    //     image(openEye, width/2, height/2);
    // }
    
    for (let i = 0; i < tentacles.length; i++) {
        let t = tentacles[i];
        t.update();
        if(p5.Vector.dist(creature.p, t.base) < segL){
            t.show();
        }
        
    }

    creature.show();
    
    // pos.set(x, y);

    

    xOff += nRate;
    yOff += nRate;
}

class EyeCluster{
    constructor(s){
        this.p = createVector(0,0);
        this.s = s;
    }

    update(x,y){
        this.p.set(x,y);
    }   

    drawEye(x,y){
        stroke(0);
        fill(255);
        circle(x, y, this.s);
        fill(0);
        let noiseVal = noise(x/eyeNoiseZoom, y/eyeNoiseZoom);
        let r = map(noiseVal, 0, 1, -0.6*this.s, 0.6*this.s);
        let a = map(noiseVal, 0, 1, 0, TWO_PI);
        circle(x + r*cos(a), y + r*sin(a), 0.4*this.s);
    }
    
    show(){
        // draw the centre eye
        this.drawEye(this.p.x, this.p.y);
       for(let i = 0; i < 6; i++){
         let a = i * TWO_PI/6;
         let r = this.s;
         this.drawEye(this.p.x + r*cos(a), this.p.y + r*sin(a));
       
       }
    }
}
