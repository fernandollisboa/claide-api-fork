import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import RandExp from "randexp";

export function createValidProject({
    name,  
    creationDate,
    endDate, 
    building,
    room,
    embrapii_code,
    financier    
} = {}){    
    return {
    name: name || faker.company.bsNoun(),
    creationDate: creationDate|| dayjs(faker.date.birthdate({min:3,max:10,mode:'age'})).format("DD/MM/YYYY"),
    endDate: endDate || dayjs(faker.date.birthdate({min:1,max:2,mode:'age'})).format("DD/MM/YYYY"),
    building: building || faker.address.country(),
    room: room || faker.address.secondaryAddress(),
    embrapii_code: embrapii_code || new RandExp(/[0-9]{11}/).gen(),
    financier: financier || faker.company.name(),
    };
}

export function createValidProjectWithoutEndDate({
    name,  
    creationDate, 
    building,
    room,
    embrapii_code,
    financier    
} = {}){    
    return {
    name: name || faker.company.bsNoun(),
    creationDate: creationDate|| dayjs(faker.date.birthdate({min:3,max:10,mode:'age'})).format("DD/MM/YYYY"),
    building: building || faker.address.country(),
    room: room || faker.address.secondaryAddress(),
    embrapii_code: embrapii_code || new RandExp(/[0-9]{11}/).gen(),
    financier: financier || faker.company.name(),
    endDate: null
    };
}

export function createValidProjectWithoutCreationDate({
    name,  
    endDate,
    building,
    room,
    embrapii_code,
    financier    
} = {}){    
    return {
    name: name || faker.company.bsNoun(),
    endDate: endDate || dayjs(faker.date.birthdate({min:1,max:2,mode:'age'})).format("DD/MM/YYYY"),
    building: building || faker.address.country(),
    room: room || faker.address.secondaryAddress(),
    embrapii_code: embrapii_code || new RandExp(/[0-9]{11}/).gen(),
    financier: financier || faker.company.name(),
    };
}

export function createValidProjectWithoutEndDateWithId({id,status, ...props}){
    return {id, status, ...createValidProjectWithoutEndDate({...props})};
}

export function createValidProjectWithoutCreationDateWithId({id,status, ...props}){
    return {id, status, ...createValidProjectWithoutCreationDate({...props})};
}

export function createValidProjectWithId({id, status, ...props}){
    return {id, status, ...createValidProject({...props})};
}

function dateToIso(date) {
    if(date){
        let [day, month, year] = date.toString().split("/");
        return `${month}/${day}/${year}`;        
    }
    return undefined
  }
