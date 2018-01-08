import _ from 'lodash';
import Node from './Node';

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
    const mul = value / total;
    info += mul * sum;
  });
  return info;
};

const getDatasetGain = (trainingSet) => {
  const attributesCount = getAttributesCount(trainingSet);
  const { inputsCount, outputCount, totalEntries, attributesCountByOutput } = attributesCount;
  const outputInfo = getInfo(outputCount, totalEntries);
  const inputInfos = inputsCount.map((inputCount, index) => getInputInfo(inputCount, totalEntries, attributesCountByOutput[index]));
  const inputGain = inputInfos.map(inputInfo => outputInfo - inputInfo);
  return inputGain;
};

// const tree = new Node();
const checkHomogeneousDataset = trainingSet => trainingSet.every((element, i, arr) => element.output === arr[0].output);

const getMostFrequentOutput = (trainingSet) => {
  const array = trainingSet.map(entry => entry.output);
  return array.sort((a, b) => array.filter(v => v === a).length - array.filter(v => v === b).length).pop();
};

const decisionTree = (trainingSet, father) => {
  const isDatasetHomogeneous = checkHomogeneousDataset(trainingSet);
  const isDatasetEmpty = trainingSet.length === 0;
  const isAttributeListEmpty = trainingSet[0].input.length === 0;
  const newNode = new Node();
  newNode.father = father;
  newNode.sons = [];
  if (isDatasetHomogeneous) {
    newNode.value = trainingSet[0].output;
    return newNode;
  } else if (isAttributeListEmpty) {
    const mostFrequentOutput = getMostFrequentOutput(trainingSet);
    newNode.value = mostFrequentOutput;
    return newNode;
  }
  const gain = getDatasetGain(trainingSet);
  const maxGain = Math.max(...gain);
  const index = gain.indexOf(maxGain);
  const newTrainingSet = JSON.parse(JSON.stringify(trainingSet));
  const removedAttributes = newTrainingSet.map(entry => entry.input.splice(index, 1));
  const mergedRemovedAttributes = removedAttributes.reduce((a, b) => [...a, ...b]);
  // console.log(mergedRemovedAttributes);

  const removedAttributesValuesWithOutputs = [];
  const removedAttributesValues = _.uniq(mergedRemovedAttributes);

  removedAttributesValues.forEach((entry) => {
    const values = [];
    values.push(trainingSet.filter(setEntry => setEntry.input[index] === entry).map(val => val.output));
    removedAttributesValuesWithOutputs.push({ value: entry, outputs: values });
  });

  removedAttributesValuesWithOutputs.sort((a, b) => a.value - b.value);
  const potentialCutPoints = [];
  // populate structure with potential cutpoints
  removedAttributesValuesWithOutputs.forEach((a, ind) => {
      let lastOutputIndex = a.outputs[0].length - 1;
      if(ind == 0){
        potentialCutPoints.push({ value: a.value, output: a.outputs[0][lastOutputIndex] });
      } else if(ind != (removedAttributesValuesWithOutputs.length - 1)){
        potentialCutPoints.push({ value: a.value, output: a.outputs[0][0] });
        potentialCutPoints.push({ value: a.value, output: a.outputs[0][lastOutputIndex] });
      } else if (ind == (removedAttributesValuesWithOutputs.length - 1)){
        potentialCutPoints.push({ value: a.value, output: a.outputs[0][0] });
      }
    //
    //console.log('index do atributo: ', index, 'valor do atributo: ', a.value, 'outputs do valor: ', a.outputs);
  });
  //console.log('test:', removedAttributesValuesWithOutputs[0].outputs[0][0]);
  // potentialCutPoints contains the first and the last values for each attributeValue (except first and last indexes), and its respective output.
  console.log('potentialCutPoints:', potentialCutPoints);

  let i = 0;
  const cutPoints = [];
  while(i < potentialCutPoints.length - 1){
    if(potentialCutPoints[i].output != potentialCutPoints[i+1].output){
      cutPoints.push((potentialCutPoints[i].value + potentialCutPoints[i+1].value) / 2);
    }
    if((i + 3) < potentialCutPoints.length){
      i += 2;
    } else{
      i = potentialCutPoints.length - 1;
    } 
    // you need to get paired entries, a cutpoint is a pair of different values with distinct outputs (e.g. (0,1), (1,2), ...).
  }
  console.log('cutPoints: ', cutPoints);
  // now, if value < cutPoint[n] then output <= yes, otherwise output <= no
  // but some datasets have 3 output classes...

  // const newDatasets = [];

  // removedAttributesValues.forEach((value) => {
  //   let valueDataset = JSON.parse(JSON.stringify(trainingSet));
  //   valueDataset = valueDataset.filter(entry => entry.input[index] === value);
  //   valueDataset.map(entry => entry.input.splice(index, 1));
  //   newDatasets.push({ dataset: valueDataset, attributeValue: value, attributeIndex: index });
  // });
  // const removedAttributesValuesWithOutputs = [];
  // // removedAttributesValues.map((entry, entryIndex) => removedAttributesValuesWithOutputs.push({ value: entry, output: trainingSet[entryIndex].output }));
  // // removedAttributesValuesWithOutputs.sort((a, b) => a.value - b.value);
  // const newDatasets = [];

  // removedAttributesValues.forEach((value) => {
  //   let valueDataset = JSON.parse(JSON.stringify(trainingSet));
  //   valueDataset = valueDataset.filter(entry => entry.input[index] === value);
  //   valueDataset.map(entry => entry.input.splice(index, 1));
  //   newDatasets.push({ dataset: valueDataset, attributeValue: value, attributeIndex: index });
  // });

  // console.log(removedAttributesValuesWithOutputs);
  // newDatasets.forEach((entry) => {
  //   newNode.attributeIndex = entry.attributeIndex;
  //   newNode.sons.push(decisionTree(entry.dataset, newNode));
  // });

  return newNode;
};

export default decisionTree;
