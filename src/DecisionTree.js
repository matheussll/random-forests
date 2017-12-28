import _ from 'lodash';

const getAttributesCount = (trainingSet) => {
  const inputs = [];
  const outputs = [];
  const inputsCount = [];

  trainingSet[0].input.forEach(() => {
    inputs.push([]); // creates an array of n arrays, n is the number of inputs of an entry
  });

  trainingSet.forEach((item) => {
    item.input.forEach((input, index) => {
      inputs[index].push(input);
    });
    outputs.push(item.output);
  });

  inputs.forEach((input) => {
    inputsCount.push(_.countBy(input));
  });

  const outputCount = _.countBy(outputs);
  const totalEntries = outputs.length;
  return { inputsCount, outputCount, totalEntries };
};


const getInfo = (count, total) => {
  let info = 0;
  Object.entries(count).forEach(([key, value]) => {
    const elementEntropy = ((-value / total) * Math.log2(value / total));
    info += elementEntropy;
  });
  return info;
};

const decisionTree = (trainingSet) => {
  const attributesCount = getAttributesCount(trainingSet);
  const { inputsCount, outputCount, totalEntries } = attributesCount;
  const outputInfo = getInfo(outputCount, totalEntries);
  const inputInfos = inputsCount.map(inputCount => getInfo(inputCount, totalEntries));
  const inputGain = inputInfos.map(inputInfo => outputInfo - inputInfo);
  return inputGain;
};

export default decisionTree;
