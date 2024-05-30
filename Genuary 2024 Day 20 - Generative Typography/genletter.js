class GenLetter{
    constructor(x,y,letter,targetX, targetY){
      this.startP = createVector(x,y);
      this.tSize = random(maxTextHeight*0.75, 1.5*maxTextHeight);
      this.a = random(radians(-10), radians(10));
      this.letter = this.genGraphic(letter);
      this.target = createVector(targetX, targetY);
      this.currentPos = createVector(this.startP.x, this.startP.y);
    }
  
    update(lerpCntrlVal){
      this.currentPos = p5.Vector.lerp(this.target, this.startP, lerpCntrlVal);
    }

    genGraphic(letter){
      let g = createGraphics(this.tSize, this.tSize);
      g.textAlign(CENTER, CENTER);
      g.textSize(this.tSize);
      g.stroke(0);
      g.fill(random(currentPalette));
      g.textFont(random(fonts));
      g.text(letter,g.width/2, g.height/2);
      return g;
    }
  
    show(){
      push();
      translate(this.currentPos.x, this.currentPos.y);
      rotate(this.a);
      image(this.letter, 0, 0);
      pop();
    }
  
  }

  function convertTextToGenLetters(srcText){
    let letters = [];
    let lines = srcText.split("\n").map(eachLine => eachLine.split(""));
    console.log(lines);
    for(let i = 0; i < lines.length; i++){
      let y = height/2 - maxTextHeight*lines.length/2 + (i+0.5)*maxTextHeight;
      let textLine = lines[i];
      let len = textLine.length;
      for(let j = 0; j < len; j++){
        let x = width/2 - maxTextHeight*len/2 + (j+0.5)*maxTextHeight;
        let startY = y <= height/2 ? -maxTextHeight : height + maxTextHeight;
        letters.push(new GenLetter(x,startY,textLine[j],x,y));
      }
    }
    return letters;
  }