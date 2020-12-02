var VlocityUILayout = module.exports = function(vlocity) {
	this.vlocity = vlocity;
};

VlocityUILayout.prototype.onDeployFinish = async function(jobInfo) {
    console.log("VlocityUILayout - onDeployFinish");
    //console.log(jobInfo);
    var layoutToCompile = {};
    for (const key in jobInfo.sourceKeyToRecordId) {
        if (key.includes("VlocityUILayout")) {
            const layoutId = jobInfo.sourceKeyToRecordId[key];
            let layout = jobInfo.sourceKeyToMatchingKeysData[key];
            console.log(key + ' ID: ' + layoutId);
            //console.log(layout);
        }
    }
}


VlocityUILayout.prototype.afterActivationSuccess = async function(inputMap) {
    var jobInfo = inputMap.jobInfo;
    var dataPack = inputMap.dataPack;
    let layoutId = jobInfo.sourceKeyToRecordId[dataPack.VlocityDataPackData['%vlocity_namespace%__VlocityUILayout__c'][0].VlocityRecordSourceKey];
    console.log("VlocityUILayout - afterActivationSuccess ID: " + layoutId);
}
