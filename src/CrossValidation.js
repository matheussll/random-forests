const createCrossValidationsSets = (dataSet) => {
    const validationSet = JSON.parse(JSON.stringify(dataSet));
    const trainingSet = validationSet.splice(0, validationSet.length * 0.8);
    return { trainingSet, validationSet };
  };
  
  const dataSetToFolds = (dataSet) => {
    const folds = [];
    const dataSetCopy = JSON.parse(JSON.stringify(dataSet));
    while (dataSetCopy.length) {
      folds.push(dataSetCopy.splice(0, dataSet.length / 5));
    }
    //console.log(folds);
    return folds;
  };
  
  const shuffleArray = (array) => {
    const arrayToShuffle = JSON.parse(JSON.stringify(array));
    for (let i = arrayToShuffle.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
    }
    return arrayToShuffle;
  };
  
  const createSetsFromFolds = (folds) => {
    const sets = [];
    for (let i = 0; i < folds.length; i += 1) {
      let trainingSet = [];
      let validationSet;
      folds.forEach((fold, foldIndex) => {
        if (foldIndex !== i) {
          trainingSet = trainingSet.concat(fold);
        } else {
          validationSet = fold;
        }
      });
      sets.push({ validationSet, trainingSet });
      //console.log('validationSet: ', validationSet);
      //console.log('trainingSet: ', trainingSet);
    }
    return sets;
  };

  const crossValidation = (dataSet) =>{
    const shuffledArray = shuffleArray(dataSet);
    const separatedSets = createCrossValidationsSets(shuffledArray);
    const folds = dataSetToFolds(separatedSets.trainingSet);
    const crossValidationSets = createSetsFromFolds(folds);
    return {trainingSets: crossValidationSets, testingSets: separatedSets.validationSet};
  }

  export default crossValidation;