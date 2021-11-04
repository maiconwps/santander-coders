const btnGenerateList = document.getElementById("btn-generate-list")
const btnSortList = document.querySelector("button[name=order]")
const spanList = document.getElementById("list")

generate_random_number = limit => Math.round(Math.random() * limit)
generate_random_numbers = (length, max) => Array(length).fill(0).map(() =>generate_random_number(max))

createPromises = (time, length) => new Promise((resolve) => setTimeout(resolve, time, generate_random_numbers(length, 100)))
concatResultValues = (arrayValues, result) => arrayValues.concat(result.value)

createItemList = text => {
    const li = document.createElement("li")
    li.innerText = text
    li.classList.add("btn")
    return li
}
addItemsInSpanList = items => items.forEach(item => spanList.appendChild(createItemList(item))) 

function get_sort_permutation(array, predicate){
    let permuationArray = []

    for(const index in array){
        if(permuationArray.length === 0){
           permuationArray[0] = index
        }
        else{
            let i = 0

            while(predicate(array[index], array[permuationArray[i]]) > 0 && i < index){
                i++
            }

            permuationArray.splice(i, 0, index)
        }
    }

    return permuationArray
}

function transform(element, tranformation){
    element.style.transform = tranformation
}
function translateAnimation(element, values){
    const x = values.x
    const y = values.y

    for(let i=1 ; i<=100; i++){
        setTimeout(transform, 15*i, element, `translate(${x/100 * i}px, ${y/100 * i}px)`)
    }
}

btnGenerateList.onclick = () => {
    const timePromisses = [
        generate_random_number(5),
        generate_random_number(5),
        generate_random_number(5)]
    spanList.innerHTML = ""
    
    const promises = timePromisses.map((time) => createPromises(time, generate_random_number(10)))
    Promise.allSettled(promises).then((results) => {
        const values = results.reduce(concatResultValues,[])
        addItemsInSpanList(values)
    })
    btnSortList.classList.remove("--is-disable")
}


btnSortList.onclick = () => {
    const numberItems =  Array.from(document.querySelectorAll("li.btn"))
    const randomNumbers = numberItems.map(numberItem => Number(numberItem.innerText))

    const sortPermutationNumbers = get_sort_permutation(randomNumbers, (a, b) => a-b)

    numberItems.map((element, index) => {
        const numberItem = numberItems[sortPermutationNumbers[index]]

        const nextReact = element.getBoundingClientRect()
        const currentReact = numberItem.getBoundingClientRect()
        translateAnimation(numberItem, {y: (nextReact.y - currentReact.y), x: (nextReact.x - currentReact.x)})
    })
    btnSortList.classList.add("--is-disable")
}