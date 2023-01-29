export function getDifference(objOld,objNew){
	
	let newValueChanged = {};
	let oldValueChanged = {};
	for (let key in objOld){
		if(objNew.hasOwnProperty(key)){
			if(typeof objOld[key] === "object"){
				if(JSON.stringify(objOld[key]) !== JSON.stringify(objNew[key])){
					newValueChanged[key] = objNew[key];
					oldValueChanged[key] = objOld[key];
				}					
			}
			else if(objOld[key] != objNew[key]){                       
				newValueChanged[key] = objNew[key];
				oldValueChanged[key] = objOld[key];
			}
		}
	}
	return {newValueChanged, oldValueChanged};  
}