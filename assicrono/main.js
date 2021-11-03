const btnGenerateList = document.getElementById("btn-generate-list")
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
}