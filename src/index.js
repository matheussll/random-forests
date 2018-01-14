import {printTree, decisionTree} from './DecisionTree';
import {createBootstrap, getRandomArbitrary} from './Ensemble';
import crossValidation from './CrossValidation';
import { TrainingSet0, TrainingSet1, TrainingSet2, TrainingSet3 } from './TrainingSets';


//const info = decisionTree(TrainingSet1);
//console.log('Ganho dos inputs do TrainingSet1: ', info);

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

// Displays dataSet from: https://moodle.inf.ufrgs.br/pluginfile.php/117478/mod_resource/content/1/ExemploAD.pdf
/*const testDataSet = [];
TrainingSet0.forEach(element => {
    var attrString = new String();
    element.input.forEach((attr, index) =>{
        switch(index){
            case 0:
                if(attr == 0){
                    attrString = attrString.concat("Ensolarado");
                } else if(attr == 1){
                    attrString = attrString.concat("Nublado");
                } else if(attr == 2){
                    attrString = attrString.concat("Chuvoso");
                }
                attrString = attrString.concat(";");  
            break;
            case 1:
                if(attr == 0){
                    attrString = attrString.concat("Quente");
                } else if(attr == 1){
                    attrString = attrString.concat("Amena");
                } else if(attr == 2){
                    attrString = attrString.concat("Fria");
                }
                attrString = attrString.concat(";");
            break;
            case 2:
                if(attr == 0){
                    attrString = attrString.concat("Alta");
                } else if(attr == 1){
                    attrString = attrString.concat("Normal");
                }
                attrString = attrString.concat(";");
            break;
            case 3:
                if(attr == 0){
                    attrString = attrString.concat("Falso");
                } else if(attr == 1){
                    attrString = attrString.concat("Veradeiro");
                }
                attrString = attrString.concat(";");
            break;
        }
    });
    element.output == 0 ? attrString = attrString.concat("Não") : attrString = attrString.concat("Sim");
    testDataSet.push(attrString = attrString);
});
//console.log(testDataSet);*/

// Generates Attribute List with m attributes, where m = sqrt(dataset.length)
const attributeList = TrainingSet0[0].input.map((attr,index) => index);
for(let i = 0; i < Math.sqrt(attributeList.length); i++){
    attributeList.splice(getRandomArbitrary(0, attributeList.length), 1);
}
//console.log('attributeList: ', attributeList);
//const tree = decisionTree(TrainingSet0, attributeList);


let stop = true;
const ntree = 5;

const crossValidationSets = crossValidation(TrainingSet0);

let ntreeTrainingSets = [];
for(let counter = 0; counter < crossValidationSets.trainingSets.length; counter++){
    const bootstraps = [];
    for(let i = 0; i < ntree; i++){
        bootstraps.push(createBootstrap(crossValidationSets.trainingSets[counter].trainingSet));
    }
    ntreeTrainingSets.push(bootstraps);
    //console.log('Counter: ', counter, 'ntreeTrainingSets: ', bootstraps);
}

const ensemble = [];
ntreeTrainingSets.forEach(trainingSet =>{
    let randomForest = [];
    trainingSet.forEach(ntreeTrainingSet =>{
        randomForest.push(decisionTree(trainingSet, attributeList));
    });
    ensemble.push(randomForest);
});
console.log('Ensemble of Random Forests: ', ensemble);


//console.log('== CrossValidation ==');
//console.log(crossValidationSets);




//const print = printTree(tree.sons, tree.label);
//console.log('Tree: ', tree);
//console.log(tree.sons[2]);

/* =====================*/