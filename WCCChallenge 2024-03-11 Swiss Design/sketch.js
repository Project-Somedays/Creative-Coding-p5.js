/*
Author: Project Somedays
Date: 2024-03-11
Title: #WCCChallenge Swiss Design

Turns out Bauhaus is a lot of tiling kind of design... so to make it interesting, I thought I would introduce Walter Gropius, credited with founding the Bauhaus movement on Wikipedia.
The fact that he was photographed in a James Macavoy Charles Xavier pose only added to the joy
Also finally wanted to learn how to mask in p5.js
*/
let walter;

function preload(){
  walter = loadImage("WalterGropius.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight, P2D);


}

function draw() {
  background(0);
  image(walter, 0, height - walter.height);

}
