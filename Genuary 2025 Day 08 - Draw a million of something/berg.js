class Iceberg{
    constructor(cx, cz, bergLength, bergWidth, bergDepth, xzdetail, ydetail, noiseDetail = 300, minHeight, maxHeight){
      this.p = createVector(cx, cz, 0);
      this.bergLength = bergLength;
      this.bergWidth = bergWidth;
      this.bergDepth = bergDepth;
      this.res = min(this.bergWidth, this.bergLength)/xzdetail;
      this.noiseDetail = noiseDetail;
      this.minHeight = minHeight;
      this.maxHeight = maxHeight;
      this.topSurface = [];
      this.bottomSurface = [];
      this.yDetail = ydetail;
      this.surfaces = this.generateSurfaces();
      this.normals = this.calculateNormals();
    
      
    // generate all surfaces
    
    }

    generateSurfaces(){
        let surfaces = [];
        for(let i = 0; i < this.yDetail; i++){
            let surface = [];
            let cDepth = 0; // intermediary layers don't need to make a bump for
            if(i === 0) cDepth = -this.maxHeight/2;
            if(i === this.yDetail - 1) cDepth = this.bergDepth;
            
            for(let x = 0; x < this.bergLength/this.res; x ++){
            let row = [];
            for(let z = 0; z < this.bergWidth/this.res; z ++){
                // at the edges, make them the same
                let xPos = -this.bergLength/2 + x*this.res + random(-this.res*0.4, this.res*0.4);
                let zPos = -this.bergWidth/2 + z*this.res + random(-this.res*0.4, this.res*0.4);
    
                let d2c = dist(xPos, zPos, 0, 0);
                let yBump = map(d2c, 0, sqrt((this.bergLength/2)**2 + (this.bergWidth/2)**2), cDepth, cDepth/2); // go deeper the further toward the middle
                let y = i * (this.maxHeight + this.bergDepth)/this.yDetail;
                let yVariation = map(noise(xPos/this.noiseDetail + i*1000, zPos/this.noiseDetail + i*1000), 0, 1, this.minHeight, this.maxHeight);
                let scaleFactor = map(noise((y + yVariation/this.noiseDetail), xPos/this.noiseDetail, zPos/this.noiseDetail), 0, 1, 0.75, 1.5);
                // let scaleFactor = 2 - abs(this.yDetail/2 - i)/this.yDetail;
                // let t = i / this.yDetail;
                // let scaleFactor = 1 + (1 - t * t);
                row.push(createVector(xPos * scaleFactor, yVariation + yBump + y, zPos * scaleFactor ));
                }
                surface.push(row);
            }
            surfaces.push(surface)
            }
        return surfaces
    }

  
    calculateNormals() {
      this.normals = [];
      
      // For each surface layer
      for(let i = 0; i < this.surfaces.length; i++) {
        let surfaceNormals = [];
        let surface = this.surfaces[i];
        
        // For each vertex in the surface
        for(let x = 0; x < surface.length; x++) {
          let rowNormals = [];
          for(let z = 0; z < surface[x].length; z++) {
            // Get adjacent vertices
            let current = surface[x][z];
            let right = x < surface.length - 1 ? surface[x + 1][z] : null;
            let bottom = z < surface[x].length - 1 ? surface[x][z + 1] : null;
            
            // Calculate normal using cross product of adjacent edges
            let normal = createVector(0, 0, 0);
            
            if(right && bottom) {
              let edge1 = p5.Vector.sub(right, current);
              let edge2 = p5.Vector.sub(bottom, current);
              normal = edge1.cross(edge2).normalize();
            }
            // Handle edge cases
            else if(right && z > 0) {
              let edge1 = p5.Vector.sub(right, current);
              let edge2 = p5.Vector.sub(surface[x][z-1], current);
              normal = edge1.cross(edge2).normalize();
            }
            else if(bottom && x > 0) {
              let edge1 = p5.Vector.sub(surface[x-1][z], current);
              let edge2 = p5.Vector.sub(bottom, current);
              normal = edge1.cross(edge2).normalize();
            }
            
            rowNormals.push(normal);
          }
          surfaceNormals.push(rowNormals);
        }
        this.normals.push(surfaceNormals);
      }
    }
    
    render() {
      if(!this.normals) this.calculateNormals();
  
      // Render top surface (first layer)
      this.renderFullSurface(0);
      
      // Render bottom surface (last layer)
      this.renderFullSurface(this.surfaces.length - 1);
      
      // Render walls using edges of intermediate layers
      this.renderWalls();
      
    }
    
    renderFullSurface(layerIndex) {
      let surface = this.surfaces[layerIndex];
      
      // Render the surface using individual triangles
      for(let x = 0; x < surface.length - 1; x++) {
        for(let z = 0; z < surface[x].length - 1; z++) {
          // Get the four corners of the quad
          let v1 = surface[x][z];
          let v2 = surface[x + 1][z];
          let v3 = surface[x][z + 1];
          let v4 = surface[x + 1][z + 1];
          
          // Get corresponding normals
          let n1 = this.normals[layerIndex][x][z];
          let n2 = this.normals[layerIndex][x + 1][z];
          let n3 = this.normals[layerIndex][x][z + 1];
          let n4 = this.normals[layerIndex][x + 1][z + 1];
          
          // Draw first triangle
          beginShape(TRIANGLES);
          normal(n1.x, n1.y, n1.z);
          vertex(v1.x, v1.y, v1.z);
          normal(n2.x, n2.y, n2.z);
          vertex(v2.x, v2.y, v2.z);
          normal(n3.x, n3.y, n3.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
          
          // Draw second triangle
          beginShape(TRIANGLES);
          normal(n2.x, n2.y, n2.z);
          vertex(v2.x, v2.y, v2.z);
          normal(n4.x, n4.y, n4.z);
          vertex(v4.x, v4.y, v4.z);
          normal(n3.x, n3.y, n3.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
        }
      }
    }
    
    renderWalls() {
      // Render front edge
      for(let i = 0; i < this.surfaces.length - 1; i++) {
        let currentLayer = this.surfaces[i];
        let nextLayer = this.surfaces[i + 1];
        
        for(let x = 0; x < currentLayer.length - 1; x++) {
          let v1 = currentLayer[x][0];
          let v2 = currentLayer[x + 1][0];
          let v3 = nextLayer[x][0];
          let v4 = nextLayer[x + 1][0];
          
          // Calculate wall normal (pointing outward)
          let normalV = p5.Vector.sub(v2, v1).cross(p5.Vector.sub(v3, v1)).normalize();
          
          // First triangle
          beginShape(TRIANGLES);
          normal(normalV.x, normalV.y, normalV.z);
          vertex(v1.x, v1.y, v1.z);
          vertex(v2.x, v2.y, v2.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
          
          // Second triangle
          beginShape(TRIANGLES);
          vertex(v2.x, v2.y, v2.z);
          vertex(v4.x, v4.y, v4.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
        }
      }
      
      // Render back edge
      for(let i = 0; i < this.surfaces.length - 1; i++) {
        let currentLayer = this.surfaces[i];
        let nextLayer = this.surfaces[i + 1];
        let lastZ = currentLayer[0].length - 1;
        
        for(let x = 0; x < currentLayer.length - 1; x++) {
          let v1 = currentLayer[x][lastZ];
          let v2 = currentLayer[x + 1][lastZ];
          let v3 = nextLayer[x][lastZ];
          let v4 = nextLayer[x + 1][lastZ];
          
          let normalV = p5.Vector.sub(v2, v1).cross(p5.Vector.sub(v3, v1)).normalize();
          normalV.mult(-1); // Flip normal for back face
          
          beginShape(TRIANGLES);
          normal(normalV.x, normalV.y, normalV.z);
          vertex(v1.x, v1.y, v1.z);
          vertex(v2.x, v2.y, v2.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
          
          beginShape(TRIANGLES);
          vertex(v2.x, v2.y, v2.z);
          vertex(v4.x, v4.y, v4.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
        }
      }
      
      // Render left edge
      for(let i = 0; i < this.surfaces.length - 1; i++) {
        let currentLayer = this.surfaces[i];
        let nextLayer = this.surfaces[i + 1];
        
        for(let z = 0; z < currentLayer[0].length - 1; z++) {
          let v1 = currentLayer[0][z];
          let v2 = currentLayer[0][z + 1];
          let v3 = nextLayer[0][z];
          let v4 = nextLayer[0][z + 1];
          
          let normalV = p5.Vector.sub(v2, v1).cross(p5.Vector.sub(v3, v1)).normalize();
          normalV.mult(-1); // Flip normal for left face
          
          beginShape(TRIANGLES);
          normal(normalV.x, normalV.y, normalV.z);
          vertex(v1.x, v1.y, v1.z);
          vertex(v2.x, v2.y, v2.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
          
          beginShape(TRIANGLES);
          vertex(v2.x, v2.y, v2.z);
          vertex(v4.x, v4.y, v4.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
        }
      }
      
      // Render right edge
      for(let i = 0; i < this.surfaces.length - 1; i++) {
        let currentLayer = this.surfaces[i];
        let nextLayer = this.surfaces[i + 1];
        let lastX = currentLayer.length - 1;
        
        for(let z = 0; z < currentLayer[0].length - 1; z++) {
          let v1 = currentLayer[lastX][z];
          let v2 = currentLayer[lastX][z + 1];
          let v3 = nextLayer[lastX][z];
          let v4 = nextLayer[lastX][z + 1];
          
          let normalV = p5.Vector.sub(v2, v1).cross(p5.Vector.sub(v3, v1)).normalize();
          
          beginShape(TRIANGLES);
          normal(normalV.x, normalV.y, normalV.z);
          vertex(v1.x, v1.y, v1.z);
          vertex(v2.x, v2.y, v2.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
          
          beginShape(TRIANGLES);
          vertex(v2.x, v2.y, v2.z);
          vertex(v4.x, v4.y, v4.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
        }
      }
    }
    
    generatePoissonPoints(minDistance, maxAttempts = 30) {
      class PoissonSurfaceSampler {
          constructor(surface, minDistance, maxAttempts) {
              this.surface = surface;
              this.minDistance = minDistance;
              this.maxAttempts = maxAttempts;
              
              // Calculate grid cell size for optimization
              this.cellSize = minDistance / Math.sqrt(2);
              
              // Initialize the grid
              this.cols = Math.ceil(surface.bergLength / this.cellSize);
              this.rows = Math.ceil(surface.bergWidth / this.cellSize);
              this.grid = new Array(this.cols * this.rows).fill(null);
              
              this.processList = [];
              this.points = [];
          }
          
          coordToIndex(x, z) {
              // Convert world coordinates to grid coordinates
              const gridX = Math.floor((x + this.surface.bergLength/2) / this.cellSize);
              const gridZ = Math.floor((z + this.surface.bergWidth/2) / this.cellSize);
              return gridX + gridZ * this.cols;
          }
          
          isValidPoint(point) {
              // Check if point is within bounds
              if (point.x < -this.surface.bergLength/2 || point.x > this.surface.bergLength/2 ||
                  point.z < -this.surface.bergWidth/2 || point.z > this.surface.bergWidth/2) {
                  return false;
              }
              
              // Get nearby cells
              const cellX = Math.floor((point.x + this.surface.bergLength/2) / this.cellSize);
              const cellZ = Math.floor((point.z + this.surface.bergWidth/2) / this.cellSize);
              
              // Check surrounding cells
              for (let i = -2; i <= 2; i++) {
                  for (let j = -2; j <= 2; j++) {
                      const col = cellX + i;
                      const row = cellZ + j;
                      if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                          const idx = col + row * this.cols;
                          const neighbor = this.grid[idx];
                          if (neighbor) {
                              const dx = neighbor.x - point.x;
                              const dz = neighbor.z - point.z;
                              const dy = neighbor.y - point.y;
                              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                              if (dist < this.minDistance) {
                                  return false;
                              }
                          }
                      }
                  }
              }
              return true;
          }
          
          generate(surfaceIndex) {
              // Add first point at center
              const firstX = 0;
              const firstZ = 0;
              const firstY = this.surface.getSurfaceHeight(firstX, firstZ, surfaceIndex);
              
              const firstPoint = createVector(firstX, firstY, firstZ);
              this.processList.push(firstPoint);
              this.points.push(firstPoint);
              this.grid[this.coordToIndex(firstPoint.x, firstPoint.z)] = firstPoint;
              
              while (this.processList.length > 0) {
                  const idx = Math.floor(Math.random() * this.processList.length);
                  const point = this.processList[idx];
                  let found = false;
                  
                  for (let i = 0; i < this.maxAttempts; i++) {
                      // Generate point in 2D (x,z plane)
                      const angle = Math.random() * Math.PI * 2;
                      const distance = this.minDistance * (1 + Math.random());
                      
                      const newX = point.x + Math.cos(angle) * distance;
                      const newZ = point.z + Math.sin(angle) * distance;
                      
                      // Get height from surface
                      const newY = this.surface.getSurfaceHeight(newX, newZ, surfaceIndex);
                      
                      if (newY !== null) {
                          const newPoint = createVector(newX, newY, newZ);
                          
                          if (this.isValidPoint(newPoint)) {
                              this.processList.push(newPoint);
                              this.points.push(newPoint);
                              this.grid[this.coordToIndex(newPoint.x, newPoint.z)] = newPoint;
                              found = true;
                              break;
                          }
                      }
                  }
                  
                  if (!found) {
                      this.processList.splice(idx, 1);
                  }
              }
              
              return this.points;
          }
      }
      
      // Create and use the sampler
      const sampler = new PoissonSurfaceSampler(this, minDistance, maxAttempts);
      return sampler;
  }
  
  // Helper method to generate and place objects
  placeObjectsWithPoisson(surfaceIndex, minDistance, objectCallback) {
      const sampler = this.generatePoissonPoints(minDistance);
      const points = sampler.generate(surfaceIndex);
      
      points.forEach(point => {
          if (objectCallback) {
              objectCallback(point);
          }
      });
      
      return points;
  }
  }  