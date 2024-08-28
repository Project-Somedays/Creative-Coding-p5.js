// from ChatGPT

class Worm{
    constructor(segCount, segLength, colour, minWeight, maxWeight){
        this.segments = [];
        this.target = createVector(0,0,0);
        for (let i = 0; i < segCount; i++) {
            let x = 0;
            let y = 0;
            let angle = 0;
            let angleZ = 0;
            let weight = map(i, 0, segCount - 1, minWeight, maxWeight)
            this.segments.push(new Segment(x, y, angle, angleZ, segLength, colour, weight));
          }
          this.base = this.segments[0]; // The base is the first segment
    }

    update(tx, ty, tz){
        // Move end effector to target
        this.target.set(tx, ty, tz);
        this.segments[this.segments.length - 1].follow(this.target.x, this.target.y, this.target.z);
        
        // Update segments positions
        for (let i = this.segments.length - 2; i >= 0; i--) {
            let next = this.segments[i+1];
            this.segments[i].follow(next.a.x, next.a.y, next.a.z);
        }
        
        // Move the base segment to keep the chain intact
        this.base.follow(this.segments[1].a.x, this.segments[1].a.y, this.segments[1].a.z);
        
        // Update all segments positions
        for (let i = 1; i < this.segments.length; i++) {
            this.segments[i].setPosition(this.segments[i - 1].b.x, this.segments[i - 1].b.y, this.segments[i - 1].b.z);
        }
        
        // update everything
        for (let segment of this.segments) {
            segment.update();   
        }

    }

    show(){

        for(let segment of this.segments){
            segment.show();
        }

    }
    

}