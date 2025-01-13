class Slug{
    constructor(slugLength, slugThick, lSegments, rSegments, ){
      this.slugLength = slugLength;
      this.rSegments = rSegments;
      this.lSegments = lSegments;
      this.r = slugThick/2;
      this.vertices = this.generateVertices();
    }
    

    generateVertices() {
        let vertices = [];
        for(let i = 0; i < this.lSegments; i++) {
            let ring = [];
            for(let j = 0; j < this.rSegments; j++) {
                let x = -this.slugLength/2 + i * this.slugLength/this.lSegments;
                let a = j * TWO_PI/this.rSegments;
                let r = (a > HALF_PI - 1.25*PI/6  && a < HALF_PI + 1.25*PI/6) ? 
                    this.r * cos(PI/6) / cos(a - HALF_PI) : 
                    this.r;
                r = i > 0.7*this.lSegments ? map(i, 0, this.lSegments - 1, r, 0.3*r) : r;
                
                // Use smoother transition for ends
                let transitionStart = 0.15; // 15% from each end
                let progress;
                
                if(i < this.lSegments * transitionStart) {
                    // Start cap
                    progress = i / (this.lSegments * transitionStart);
                    // Use sine function for smoother transition
                    progress = sin(progress * HALF_PI);
                } else if(i > this.lSegments * (1 - transitionStart)) {
                    // End cap
                    progress = (this.lSegments - i) / (this.lSegments * transitionStart);
                    // Use sine function for smoother transition
                    progress = sin(progress * HALF_PI);
                } else {
                    progress = 1;
                }
                
                // Apply radius scaling for ends
                r *= progress;
                
                if(i < this.lSegments * transitionStart || i > this.lSegments * (1 - transitionStart)) {
                    // Create hemisphere shape at ends
                    let phi = i < this.lSegments * transitionStart ? 
                        map(i, 0, this.lSegments * transitionStart, HALF_PI, 0) :
                        map(i, this.lSegments * (1 - transitionStart), this.lSegments, 0, HALF_PI);
                    
                    let y = r * cos(phi) * sin(a);
                    let z = r * cos(phi) * cos(a);
                    ring.push(createVector(x, y, z));
                } else {
                    let y = r * sin(a);
                    let z = r * cos(a);
                    ring.push(createVector(x, y, z));
                }
            }
            vertices.push(ring);
        }
        return [...vertices];
    }
    // generateVertices(){
    //   let vertices = [];
    //   for(let i = 0; i < this.lSegments; i++){
    //     let ring = [];
    //     for(let j = 0; j < this.rSegments; j++){
    //         let x = -this.slugLength/2 + i * this.slugLength/this.lSegments;
    //         let a = j * TWO_PI/this.rSegments;
    //         let r = (a > HALF_PI - 1.25*PI/6  && a < HALF_PI + 1.25*PI/6) ? 
    //             this.r * cos(PI/6) / cos(a - HALF_PI) : 
    //             this.r;
    //       if(i > this.lSegments*0.1 && i < this.lSegments*0.9){
            
            
            
    //         let y = r * sin(a);
    //         let z = r * cos(a);
    //         ring.push(createVector(x,y,z));
    //       } else {
    //         let phi = i <= 0.2*this.lSegments ? map(x, -this.slugLength/2, -this.slugLength/2 + 0.2*this.slugLength, HALF_PI, 0) : map(x,-this.slugLength/2 + 0.8*this.slugLength, -this.slugLength/2 + this.slugLength, 0, HALF_PI);
    //         let y = r * cos(phi) * sin(a);
    //         let z = r * cos(phi) * cos(a);
    //         ring.push(createVector(x,y,z));
    //       }
          
    //     }
    //     vertices.push(ring);
    //   }
    // //   console.log(vertices);
    //   return [...vertices];
    // }
    

    
    show(){
        for(let i = 1; i < this.lSegments; i++) {
            for(let j = 0; j < this.rSegments; j++) {
                // Calculate indices with wrapping for the angular coordinate
                let currentA = j;
                let nextA = (j + 1) % this.rSegments;
                
                let currentRingCurrentA = this.vertices[i][currentA];
                let prevRingCurrentA = this.vertices[i-1][currentA];
                let prevRingNextA = this.vertices[i-1][nextA];
                let currentRingNextA = this.vertices[i][nextA];
                
                // First triangle
                beginShape(TRIANGLES);
                vertex(prevRingCurrentA.x, prevRingCurrentA.y, prevRingCurrentA.z);
                vertex(prevRingNextA.x, prevRingNextA.y, prevRingNextA.z);
                vertex(currentRingNextA.x, currentRingNextA.y, currentRingNextA.z);
                endShape();

                // Second triangle
                beginShape(TRIANGLES);
                vertex(currentRingNextA.x, currentRingNextA.y, currentRingNextA.z);
                vertex(currentRingCurrentA.x, currentRingCurrentA.y, currentRingCurrentA.z);
                vertex(prevRingCurrentA.x, prevRingCurrentA.y, prevRingCurrentA.z);
                endShape();
            }
        }
    }
}
  