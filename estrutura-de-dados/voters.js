const handlerVotes = (numVotesField, numPeopleField) => (data, person) => {
    new_data = {...data}
    new_data[numVotesField] = person.voted? data[numVotesField] + 1: data[numVotesField];
    new_data[numPeopleField] = data[numPeopleField] + 1
    return new_data
}

const handlerYoung = handlerVotes("numYoungVotes", "numYoungPeople")
const handlerMid = handlerVotes("numMidsVotes", "numMidsPeople")
const handlerOld = handlerVotes("numOldsVotes", "numOldsPeople")

const factoryVoterPeople = (ageGroup, minAge, maxAge, handler) => ({ageGroup, minAge, maxAge, handler})
const isInRange = (min, max) => number => number >= min && number <= max

const VOTERS = [
    factoryVoterPeople("young", 18, 25, handlerYoung),
    factoryVoterPeople("mid", 26, 35, handlerMid),
    factoryVoterPeople("old", 36, 55, handlerOld),

]
const calculateNumberOfVotes = (acc, current) => {
    for(const voter of VOTERS){
        if(isInRange(voter.minAge, voter.maxAge)(current.age)){
            return voter.handler(acc, current)
        }
    }
}

//---------------------------------Teste-------------------------------------------

const people =[
    { name: 'Bob', age: 30, voted: true },
    { name: 'Jake', age: 32, voted: true },
    { name: 'Kate', age: 25, voted: false },
    { name: 'Sam', age: 20, voted: false },
    { name: 'Phil', age: 21, voted: true },
    { name: 'Ed', age: 55, voted: true },
    { name: 'Tami', age: 54, voted: true },
    { name: 'Mary', age: 31, voted: false },
    { name: 'Becky', age: 43, voted: false },
    { name: 'Joey', age: 41, voted: true },
    { name: 'Jeff', age: 30, voted: true },
    { name: 'Zack', age: 19, voted: false }]

const output = people.reduce(
    calculateNumberOfVotes,{
        numYoungVotes: 0,
        numYoungPeople: 0,
        numMidsVotes: 0,
        numMidsPeople: 0,
        numOldsVotes: 0,
        numOldsPeople: 0} )

console.log(output)