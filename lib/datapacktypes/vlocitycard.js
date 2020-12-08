var path = require('path');
var VlocityCard = module.exports = function(vlocity) {
	this.vlocity = vlocity;
};

VlocityCard.prototype.onDeployFinish = async function(jobInfo) {
    console.log("VlocityCard - onDeployFinish");
    //console.log(jobInfo);
    var cardsToCompile = {};
    for (const key in jobInfo.sourceKeyToRecordId) {
        if (key.includes("VlocityCard")) {
            const cardId = jobInfo.sourceKeyToRecordId[key];
            let card = jobInfo.sourceKeyToMatchingKeysData[key];
            console.log(key + ' ID: ' + cardId);
            var defintionFile = path.join(jobInfo.projectPath, jobInfo.expansionPath,'VlocityCard');
            //console.log(defintionFile);
            //console.log(card);
        }
    }
}


VlocityCard.prototype.afterActivationSuccess = async function(inputMap) {
    var jobInfo = inputMap.jobInfo;
    var dataPack = inputMap.dataPack;
    let cardId = jobInfo.sourceKeyToRecordId[dataPack.VlocityDataPackData['%vlocity_namespace%__VlocityCard__c'][0].VlocityRecordSourceKey];
    console.log("VlocityCard - afterActivationSuccess ID: " + cardId); 
}
