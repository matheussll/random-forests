import _ from 'lodash';

const getAttributesCount = (trainingSet) => {
  const inputs = [];
  const outputs = [];
  const inputsCount = [];
  const attributesCountByOutput = [];

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
    const filteredOutputs = _.uniq(outputs);
    const allInputsWithOutputs = filteredOutputs.map((output) => {
      const inputsWithOutput = input.map((element, index) => ({ input: element, output: trainingSet[index].output }));
      const filteredInputsWithOutput = inputsWithOutput.filter(x => x.output === output);
      const filteredInputs = filteredInputsWithOutput.map(x => x.input);
      const filteredInputsCount = _.countBy(filteredInputs);

      return filteredInputsCount;
    });
    attributesCountByOutput.push(allInputsWithOutputs);
    inputsCount.push(_.countBy(input));
  });

  const outputCount = _.countBy(outputs);
  const totalEntries = outputs.length;
  return { inputsCount, outputCount, totalEntries, attributesCountByOutput };
};


const getInfo = (count, total) => {
  let info = 0;
  Object.entries(count).forEach(([key, value]) => {
    const elementEntropy = ((-value / total) * Math.log2(value / total));
    info += elementEntropy;
  });
  return info;
};

const getInputInfo = (count, total, attributeCountByOutput) => {
  let info = 0;
  // console.log(attributeCountByOutput);

  Object.entries(count).forEach(([key, value]) => {
    let sum = 0;
    attributeCountByOutput.forEach((output) => {
      // console.log(attributeCountByOutput);
      Object.entries(output).forEach(([attrKey, attrValue]) => {
        if (attrKey === key) {
          const elementEntropy = ((-attrValue / value) * Math.log2(attrValue / value));
          sum += elementEntropy;
        }
      });
    });
    console.log(sum);
    const mul = value / total;
    console.log(mul);

    info += mul * sum;
  });
  return info;
};

const decisionTree = (trainingSet) => {
  const attributesCount = getAttributesCount(trainingSet);
  const { inputsCount, outputCount, totalEntries, attributesCountByOutput } = attributesCount;
  const outputInfo = getInfo(outputCount, totalEntries);
  const inputInfos = inputsCount.map((inputCount, index) => getInputInfo(inputCount, totalEntries, attributesCountByOutput[index]));
  const inputGain = inputInfos.map(inputInfo => outputInfo - inputInfo);
  return inputGain;
};

export default decisionTree;
