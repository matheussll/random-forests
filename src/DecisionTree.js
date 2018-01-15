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

const getCutPointsFromArray = (valuesWithOutputsArray) =>{
  const potentialCutPoints = [];
  // populate structure with potential cutpoints
  valuesWithOutputsArray.forEach((a, ind) => {
      let lastOutputIndex = a.outputs[0].length - 1;
      if(ind == 0){
        potentialCutPoints.push({ value: a.value, output: a.outputs[0][lastOutputIndex] });
      } else if(ind != (valuesWithOutputsArray.length - 1)){
        potentialCutPoints.push({ value: a.value, output: a.outputs[0][0] });
        potentialCutPoints.push({ value: a.value, output: a.outputs[0][lastOutputIndex] });
      } else if (ind == (valuesWithOutputsArray.length - 1)){
        potentialCutPoints.push({ value: a.value, output: a.outputs[0][0] });
      }
    //
    //console.log('index do atributo: ', index, 'valor do atributo: ', a.value, 'outputs do valor: ', a.outputs);
  });
  //console.log('test:', removedAttributesValuesWithOutputs[0].outputs[0][0]);
  // potentialCutPoints contains the first and the last values for each attributeValue (except first and last indexes), and its respective output.
  //console.log('potentialCutPoints:', potentialCutPoints);

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
  return cutPoints;
};
// now, if value < cutPoint[n] then output <= yes, otherwise output <= no
// but some datasets have 3 output classes...

const decisionTree = (trainingSet, attributeList) => {
  //console.log('dataSet: ', trainingSet);
  const newAttributeList = JSON.parse(JSON.stringify(attributeList));
  const isDatasetHomogeneous = checkHomogeneousDataset(trainingSet);
  const isDatasetEmpty = trainingSet.length === 0;
  const isAttributeListEmpty = newAttributeList.length === 0;

  const newNode = new Node();
  newNode.sons = [];

  //console.log("H: ", isDatasetHomogeneous, "de ", isDatasetEmpty, "ae ", isAttributeListEmpty);
  if (isDatasetHomogeneous) {
    newNode.value = trainingSet[0].output;
    return newNode;
  } else if (isAttributeListEmpty) {
    const mostFrequentOutput = getMostFrequentOutput(trainingSet);
    newNode.value = mostFrequentOutput;
    return newNode;
  }
  const gain = getDatasetGain(trainingSet);
  let fixedGain = [];
  gain.forEach(value =>{
    fixedGain.push(value.toFixed(3));
  });
  //console.log("Gains: ", fixedGain);
  const maxGain = Math.max(...gain);
  const index = gain.indexOf(maxGain);

  //console.log('index: ', index);
  newNode.label = index;
  newAttributeList.splice(index, 1);

  const newTrainingSet = JSON.parse(JSON.stringify(trainingSet));
  const removedAttributes = newTrainingSet.map(entry => entry.input.splice(index, 1));
  const mergedRemovedAttributes = removedAttributes.reduce((a, b) => [...a, ...b]);
  const removedAttributesValues = _.uniq(mergedRemovedAttributes);

  // CutPoints
  const removedAttributesValuesWithOutputs = [];
  removedAttributesValues.forEach((entry) => {
    const values = [];
    values.push(trainingSet.filter(setEntry => setEntry.input[index] === entry).map(val => val.output));
    removedAttributesValuesWithOutputs.push({ value: entry, outputs: values });
  });

  removedAttributesValuesWithOutputs.sort((a, b) => a.value - b.value);

  /*removedAttributesValuesWithOutputs.forEach((a) => {
    console.log('index do atributo: ', index, 'valor do atributo: ', a.value, 'outputs do valor: ', a.outputs);
  });*/

  const cutPoints = getCutPointsFromArray(removedAttributesValuesWithOutputs);
  //console.log('CutPoints:');
  //console.log(cutPoints);
  // CutPoints
  //console.log('Attr size: ', removedAttributesValues.length);
  //console.log('CutPoint Size: ', cutPoints.length);
  cutPoints.forEach((cutPoint, index) =>{
    //console.log('CutPoint index: ', index);
    const dataSets = [];
    removedAttributesValues.forEach((value, idx) =>{
    //console.log('index: ', index, 'rel attr: ', value);
    //console.log('Attr index: ', idx);
      if(value <= cutPoint){
        dataSets.push(trainingSet.filter(entry => entry.input[index] <= cutPoint));
      } else{
        dataSets.push(trainingSet.filter(entry => entry.input[index] > cutPoint));
      }
    });
    //newNode.relativeAttribute = value;
    //dataSets.push(trainingSet.filter(entry => entry.input[index] === value));

    dataSets.forEach(dataSet =>{
      if(dataSet.length === 0){
        newNode.value = getMostFrequentOutput(trainingSet);
        return newNode;
      }
      newNode.sons.push(decisionTree(dataSet, newAttributeList));
    });
  });

  return newNode;
};

const printTree = (tree, root) =>{
  if(root != null){
    console.log('');
    console.log('Root:', root);
  }
  tree.forEach((node, index) =>{
    if(node.sons.length != 0){
      console.log('');
      console.log('Node:', node.label);
      printTree(node.sons, null);
    } else {
      console.log('Leaf:', node.value);
      if(index == (tree.length - 1)){
        console.log('');
      }
    }
  });
}

module.exports = {printTree, decisionTree};
//export default decisionTree;

