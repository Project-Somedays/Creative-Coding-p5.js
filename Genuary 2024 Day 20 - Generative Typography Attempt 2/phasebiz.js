// ----------- WHICH PHASE WE IN? --------------- //
function getCurrentPhase(currentFrame){
    // gets the smallest phase greater than currentFrame
    let cumulativeFrames = phaseOrder.map(e => e.cumulativeFrames);
    for(let i = 0; i < cumulativeFrames.length; i++){
      if(currentFrame < cumulativeFrames[i]) return phaseOrder[i];
    }
  }
  
  // ----------- GET CUMULATIVE FRAMES --------------- //
  function setCumulativeFrames(phaseOrder){
    let total = 0;
    for(let i = 0; i < phaseOrder.length; i++){
      let frameArray = phaseOrder.map(e => e.frames).slice(0,i+1);
      let total = frameArray.length > 0 ? frameArray.reduce((a,b) => a + b) : phaseOrder[0].frames;
      phaseOrder[i]["cumulativeFrames"] = total;
    }
  }

  