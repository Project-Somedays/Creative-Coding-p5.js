class Conveyor{
    constructor(h, sectionWidth){
        this.h = h;
        this.sectionWidth = sectionWidth;
        this.sections = [];
        for(let i = -this.sectionWidth*1.5; i < width + this.sectionWidth*1.5; i += this.sectionWidth){
            this.sections[i] = i;
        }
    }

    update(rate){
        for(let i = this.sections.length - 1; i >= 0; i--){
            this.sections[i] += rate;
            if(this.sections[i] > width + this.sectionWidth){
                this.sections.splice(i,1);
                this.sections.push(-this.sectionWidth*1.5);
            }
        }

    }

    show(){
        stroke(0);
        strokeWeight(5);
        fill(200);
        for(let s of this.sections){
            rect(s, height/2, this.sectionWidth, this.h);
        }
    }
}