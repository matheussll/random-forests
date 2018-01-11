import decisionTree from './DecisionTree';
import getMajorityVotes from './Ensemble';
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
const testDataSet = [];
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
console.log(testDataSet);

/* =====================*/