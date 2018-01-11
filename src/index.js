import decisionTree from './DecisionTree';
import getMajorityVotes from './Ensemble';
import { TrainingSet1, TrainingSet2, TrainingSet3 } from './TrainingSets';


const info = decisionTree(TrainingSet1);
console.log('Ganho dos inputs do TrainingSet1: ', info);

/*let votes = [];
votes.push(0);
votes.push(1);
votes.push(1);
votes.push(1);
votes.push(1);
votes.push(2);
votes.push(2);
votes.push(2);

const majorityVote = getMajorityVotes(votes);
console.log('Majority vote: ', majorityVote);*/