const CALCULATOR = (() => {
    // -------------------------------BASIC FUNCTIONS------------------------------------------------------
    const _containsValue = array => value => array.includes(value)
    const _filter = predicate => array => array.filter(predicate)
    const _map = callback => array => array.map(callback)
    const _find = predicate => array => array.find(predicate)
    const _findIndex = predicate => array => array.findIndex(predicate)
    const _sort = array => array.sort()
    const _removeDuplicates = array => Array.from(new Set(array))
    const _last = array => ([...array].pop())

    const _getProperty = prop => obj => obj[prop]
    const _isPropertyEquals = prop => value => obj => obj[prop] == value
    const _listPropValues = prop => array => _map(_getProperty(prop))(array)
    const _filterByPropValue = prop => value => array => _filter(_isPropertyEquals(prop)(value))(array)
    const _findByPropertyValue = prop => array => value => _find(_isPropertyEquals(prop)(value))(array)
    const _getIndexByValues = values => array => _findIndex(_containsValue(values))(array)
    const _replaceSubarrayByElement = (array, start, len, element) => {
        const _newArray = [...array]
        _newArray.splice(start, len, element)
        return _newArray
    }

    // -------------------------------VARIABLES------------------------------------------------------
    let historic = []
    let currentExpression = []

    // -------------------------------UTILITY FUNCTIONS------------------------------------------------------
    const isValidNumber = value => typeof (value) === "number" && !isNaN(value) && isFinite(value)

    // -------------------------------OPERATIONS------------------------------------------------------
    const addOperation = (operand1, operand2) => operand1 + operand2
    const subOperation = (operand1, operand2) => operand1 - operand2
    const multOperation = (operand1, operand2) => operand1 * operand2
    const divOperation = (operand1, operand2) => operand1 / operand2
    const powOperation = Math.pow
    const factoryMathOperation = (operator, priority, handler) => ({ operator, priority, handler })

    const MATH_OPERATIONS = [
        factoryMathOperation("+", 3, addOperation),
        factoryMathOperation("-", 3, subOperation),
        factoryMathOperation("*", 2, multOperation),
        factoryMathOperation("/", 2, divOperation),
        factoryMathOperation("^", 1, powOperation),
    ]

    // OPERATION GENERIC FUNCTIONS
    const getOperationByOperator = _findByPropertyValue("operator")(MATH_OPERATIONS)
    const getOperatorsByPriority = value => _listPropValues("operator")(_filterByPropValue("priority")(value)(MATH_OPERATIONS))
    const getOperatorIndexes = (mathExpression, operators) => _getIndexByValues(operators)(mathExpression)

    // OPERATION CONSTANTS
    const OPERATION_PRIORITIES = _sort(_removeDuplicates(_listPropValues("priority")(MATH_OPERATIONS)))
    const OPERATORS = _listPropValues("operator")(MATH_OPERATIONS)

    // OPERATION SPECIFIC FUNCTIONS
    const isValidOperator = _containsValue(OPERATORS)

    // -------------------------------CALCULATE FUNCTIONS------------------------------------------------------
    const resolveOperation = (mathExpression, operatorIndex) => {
        const operator = mathExpression[operatorIndex]
        const operation = getOperationByOperator(operator)
        const operands = []

        operands.push(mathExpression[operatorIndex - 1])
        operands.push(mathExpression[operatorIndex + 1])
        result = operation.handler(...operands)

        return _replaceSubarrayByElement(mathExpression, operatorIndex - 1, 3, result)
    }

    const resolveSelectOperations = (mathExpression, operators) => {
        let newMathExpression = [...mathExpression]
        let currentOperatorIndex = getOperatorIndexes(newMathExpression, operators)

        while (currentOperatorIndex !== -1) {
            newMathExpression = resolveOperation(newMathExpression, currentOperatorIndex)
            currentOperatorIndex = getOperatorIndexes(newMathExpression, operators)
        }

        return newMathExpression
    }

    const resolveExpression = (mathExpression) => {
        let result = [...mathExpression]

        for (priority of OPERATION_PRIORITIES) {
            const currentAbleOperators = getOperatorsByPriority(priority)
            result = resolveSelectOperations(result, currentAbleOperators)

            if (result.length == 1) {
                return result[0]
            }
        }
    }


    // ----------------------------------MAIN FUNCTIONS--------------------------------------------------
    const enter = (input) => {
        const lastDigit = _last(currentExpression)

        if (isValidNumber(lastDigit)) {
            if (!isValidOperator(input)) {
                throw Error(`É esperado um operador.`)
            }
        }
        else if (!isValidNumber(input)) {
                throw Error(`É esperado um número.`)
        }

        currentExpression.push(input)
    }

    const equals = () => {
        const result = resolveExpression(currentExpression)
        historic.push(`${currentExpression.join(" ")} = ${result}`)
        currentExpression = []
        return result
    }
    const list = () => historic
    const reset = () => currentExpression = []

    return {
        enter,
        equals,
        list,
        reset
    }
}
)()

//-----------------------------------------Testes-----------------------------------------

function calculate(...inputs){
    inputs.map(CALCULATOR.enter)
    return CALCULATOR.equals()
}

calculate(2, "+", 4)
calculate(5, "-", 10)
calculate(8, "/", 4)
calculate(3, "*", 4)
calculate(5, "^", 3)
calculate(7, "+", 1, "-", 2)
calculate(7, "+", 1, "*", 2)
calculate(128, "/", 8, "^", 2, "+", 7, "-", 3, "*", 4, "^", 2)
console.log(CALCULATOR.list())