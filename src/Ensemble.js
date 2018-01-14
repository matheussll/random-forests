function createBootstrap(trainingSet){
    let i = 0;
    let newTrainingSet = [];
      while(i < trainingSet.length){
        let index = getRandomArbitrary(0, trainingSet.length);
        //console.log('index: ', index);
        newTrainingSet.push(trainingSet[index]);
        i++;
      }
      return newTrainingSet;
    }
    
function getRandomArbitrary(min, max) {
      return Math.floor((Math.random() * (max - min) + min));
    }

const getMajorityVote = (votes) =>{
  let classes = [];
  votes.forEach(vote => {
    let i = 0;
    if(classes.length != 0){
      let found = false;
      while(!found && i < classes.length){
        if(classes[i].output == vote){
          classes[i].counter++;
          found = true;
        }
        i++;
      }
      if(!found){
        classes.push({output: vote, counter: 1});
      }
      found = false;
    }
    else{
      classes.push({output: vote, counter: 1});
    }  
  });

  let maj = 0;
  let outputClass = 0;
  classes.forEach(item => {
    if(item.counter > maj){
      maj = item.counter;
      outputClass = item.output;
    }
  });

  return outputClass;
}

module.exports = {createBootstrap, getRandomArbitrary};