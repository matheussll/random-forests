function createBootstrap(trainingSet){
    let i = 0;
    let newTrainingSet = [];
      while(i < trainingSet.length){
        let index = getRandomArbitrary(0, trainingSet.length);
        newTrainingSet.push(trainingSet[index]);
        i++;
      }
      return newTrainingSet;
    }
    
function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }