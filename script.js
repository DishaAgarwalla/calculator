// Calculator State
let currentInput = '0';
let previousInput = '';
let operator = null;
let resetScreen = false;
let calculated = false;
let memory = 0;

// DOM Elements
const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');

// Update Display Functions
function updateDisplay() {
    let displayValue = currentInput;
    
    // Handle large numbers
    if (displayValue.length > 12) {
        const num = parseFloat(displayValue);
        if (!isNaN(num)) {
            if (Math.abs(num) > 1e12 || Math.abs(num) < 1e-6) {
                displayValue = num.toExponential(6);
            } else {
                displayValue = displayValue.substring(0, 12);
                if (displayValue.endsWith('.')) {
                    displayValue = displayValue.slice(0, -1);
                }
            }
        }
    }
    
    display.textContent = displayValue;
    updateExpression();
}

function updateExpression() {
    if (operator && previousInput) {
        const operatorSymbols = {
            '+': '+',
            '-': '−',
            '×': '×',
            '/': '÷'
        };
        expressionDisplay.textContent = `${previousInput} ${operatorSymbols[operator]}`;
    } else {
        expressionDisplay.textContent = '';
    }
}

// Core Calculator Functions
function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    resetScreen = false;
    calculated = false;
    display.classList.remove('error');
    updateDisplay();
}

function deleteLast() {
    if (currentInput === 'Error') {
        clearCalculator();
        return;
    }
    
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function appendNumber(num) {
    if (resetScreen || currentInput === 'Error' || currentInput === '0' || calculated) {
        currentInput = '';
        resetScreen = false;
        calculated = false;
        display.classList.remove('error');
    }
    
    if (num === '0' && currentInput === '0') {
        return;
    }
    
    if (currentInput.length >= 15) {
        return;
    }
    
    currentInput = currentInput === '0' ? num : currentInput + num;
    updateDisplay();
}

function appendDecimal() {
    if (resetScreen || currentInput === 'Error' || calculated) {
        currentInput = '0';
        resetScreen = false;
        calculated = false;
        display.classList.remove('error');
    }
    
    if (!currentInput.includes('.')) {
        if (currentInput.length >= 15) {
            return;
        }
        currentInput += '.';
        updateDisplay();
    }
}

function chooseOperator(op) {
    if (currentInput === 'Error') return;
    
    if (operator !== null && !resetScreen) {
        calculate();
        if (currentInput === 'Error') return;
    }
    
    operator = op;
    previousInput = currentInput;
    resetScreen = true;
    calculated = false;
    updateDisplay();
}

function calculate() {
    if (currentInput === 'Error' || operator === null || resetScreen) return;
    
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(curr)) return;
    
    let result;
    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '×':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                showError("Cannot divide by zero");
                return;
            }
            result = prev / curr;
            break;
        default:
            return;
    }
    
    // Handle floating point precision
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    calculated = true;
    updateDisplay();
}

function square() {
    if (currentInput === 'Error') return;
    
    const num = parseFloat(currentInput);
    const result = num * num;
    currentInput = result.toString();
    calculated = true;
    updateDisplay();
}

function percentage() {
    if (currentInput === 'Error') return;
    
    const num = parseFloat(currentInput);
    currentInput = (num / 100).toString();
    calculated = true;
    updateDisplay();
}

function toggleSign() {
    if (currentInput === 'Error') return;
    
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.substring(1);
    } else if (currentInput !== '0') {
        currentInput = '-' + currentInput;
    }
    updateDisplay();
}

// Utility Functions
function showError(message) {
    currentInput = 'Error';
    display.textContent = message;
    display.classList.add('error');
    operator = null;
    previousInput = '';
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 8
    }).format(num);
}

function animateButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 100);
    }
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Number buttons
    document.getElementById('zero').addEventListener('click', () => {
        appendNumber('0');
        animateButton('zero');
    });
    
    document.getElementById('one').addEventListener('click', () => {
        appendNumber('1');
        animateButton('one');
    });
    
    document.getElementById('two').addEventListener('click', () => {
        appendNumber('2');
        animateButton('two');
    });
    
    document.getElementById('three').addEventListener('click', () => {
        appendNumber('3');
        animateButton('three');
    });
    
    document.getElementById('four').addEventListener('click', () => {
        appendNumber('4');
        animateButton('four');
    });
    
    document.getElementById('five').addEventListener('click', () => {
        appendNumber('5');
        animateButton('five');
    });
    
    document.getElementById('six').addEventListener('click', () => {
        appendNumber('6');
        animateButton('six');
    });
    
    document.getElementById('seven').addEventListener('click', () => {
        appendNumber('7');
        animateButton('seven');
    });
    
    document.getElementById('eight').addEventListener('click', () => {
        appendNumber('8');
        animateButton('eight');
    });
    
    document.getElementById('nine').addEventListener('click', () => {
        appendNumber('9');
        animateButton('nine');
    });

    // Operation buttons
    document.getElementById('decimal').addEventListener('click', () => {
        appendDecimal();
        animateButton('decimal');
    });
    
    document.getElementById('add').addEventListener('click', () => {
        chooseOperator('+');
        animateButton('add');
    });
    
    document.getElementById('subtract').addEventListener('click', () => {
        chooseOperator('-');
        animateButton('subtract');
    });
    
    document.getElementById('multiply').addEventListener('click', () => {
        chooseOperator('×');
        animateButton('multiply');
    });
    
    document.getElementById('divide').addEventListener('click', () => {
        chooseOperator('/');
        animateButton('divide');
    });
    
    document.getElementById('equals').addEventListener('click', () => {
        calculate();
        animateButton('equals');
    });
    
    document.getElementById('clear').addEventListener('click', () => {
        clearCalculator();
        animateButton('clear');
    });
    
    document.getElementById('backspace').addEventListener('click', () => {
        deleteLast();
        animateButton('backspace');
    });
    
    document.getElementById('square').addEventListener('click', () => {
        square();
        animateButton('square');
    });
    
    document.getElementById('percentage').addEventListener('click', () => {
        percentage();
        animateButton('percentage');
    });
    
    // Add click handler for sign toggle (optional button not in HTML)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) {
            e.target.blur();
        }
    });
}

// Keyboard Support
function initializeKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        // Number keys
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            appendNumber(e.key);
            animateButton(getNumberButtonId(e.key));
        }
        
        // Decimal point
        if (e.key === '.') {
            e.preventDefault();
            appendDecimal();
            animateButton('decimal');
        }
        
        // Operators
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            e.preventDefault();
            const operators = {
                '+': '+',
                '-': '-',
                '*': '×',
                '/': '/'
            };
            chooseOperator(operators[e.key]);
            animateButton(getOperatorButtonId(e.key));
        }
        
        // Calculate
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculate();
            animateButton('equals');
        }
        
        // Clear
        if (e.key === 'Escape' || e.key === 'Delete') {
            e.preventDefault();
            clearCalculator();
            animateButton('clear');
        }
        
        // Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            deleteLast();
            animateButton('backspace');
        }
        
        // Percentage
        if (e.key === '%') {
            e.preventDefault();
            percentage();
            animateButton('percentage');
        }
        
        // Square
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            square();
            animateButton('square');
        }
        
        // Toggle sign
        if (e.key === '_' || e.key === 'n' || e.key === 'N') {
            e.preventDefault();
            toggleSign();
        }
    });
}

// Helper functions for keyboard support
function getNumberButtonId(key) {
    const numberIds = {
        '0': 'zero',
        '1': 'one',
        '2': 'two',
        '3': 'three',
        '4': 'four',
        '5': 'five',
        '6': 'six',
        '7': 'seven',
        '8': 'eight',
        '9': 'nine'
    };
    return numberIds[key];
}

function getOperatorButtonId(key) {
    const operatorIds = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide'
    };
    return operatorIds[key];
}

// Initialize Calculator
function initializeCalculator() {
    initializeEventListeners();
    initializeKeyboardSupport();
    updateDisplay();
    
    // Add keyboard focus indicator
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('click', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Start the calculator when page loads
document.addEventListener('DOMContentLoaded', initializeCalculator);

// Export for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        clearCalculator,
        appendNumber,
        chooseOperator,
        calculate,
        square,
        percentage,
        toggleSign
    };
}