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
  
  const createNetworkTestSets = (folds) => {
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
    }
    return sets;
  };