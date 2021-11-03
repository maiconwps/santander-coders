class Person{
    
    constructor(firstName, lastName, age, gender, interests){
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
        this.gender = gender
        this.interests = interests
    }
    get name(){
        return `${this.firstName} ${this.lastName}`
    }

    get bio(){
      return `${this.name} is ${this.age} years old. They like ${this.interests.join(", ")}.`
    }

    greeting(){
        return `Hi! I'm ${this.name}`
    }
}

class Teacher extends Person{
    constructor(firstName, lastName, age, gender, interests, subject){
        super(firstName, lastName, age, gender, interests)
        this.subject = subject
    }

    greeting(){
        const prefix = this.gender === "female"? "Mrs.": "Mr."
        return `Hello! My name is ${prefix} ${this.lastName}, and I teach ${this.subject}.`
    }
}

class Student extends Person{
    greeting(){
        return `Yo! I'm ${this.lastName}.`
    }
}

const murilo = new Teacher("Murilo", "Morais", 26, "male", ["teach", "software", "music"], "frontend")
console.log(murilo.bio)
console.log(murilo.greeting())
