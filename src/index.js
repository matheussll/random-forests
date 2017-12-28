import decisionTree from './DecisionTree';
import { TrainingSet1, TrainingSet2, TrainingSet3 } from './TrainingSets';

const info = decisionTree(TrainingSet1);
console.log('Ganho dos inputs do TrainingSet1: ', info);
