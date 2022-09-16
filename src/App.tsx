


import { useEffect, useReducer } from 'react';
import InputButton from './InputButton';
import { DecimalToFraction, Fraction } from './FractionUtils';



import './styles.css';
import { CombinedCodeActions } from 'typescript';
import { KeyType } from 'crypto';
import { EventType } from '@testing-library/react';

export const ACTIONS = {
  MODE: 'mode',
  CLEAR: 'clear',
  DELETE_LAST: 'delete-last',
  EVALUATE: 'evaluate',
  KEYPAD: 'keypad',
  START: 'start',
  NEGATE: 'negate',
  DIGIT: 'digit',
  PERIOD: 'period',
  PIPE: 'pipe',
  PERIOD_DIGITS: 'period-digits',
  FRACTION_NUMERATOR: 'fraction-numerator',
  FRACTION_NEGATE: 'fraction-negate',
  FRACTION_DENOMINATOR: 'fraction-denominator'
}

export const KEYS = {
  BTN1: "btn1",
  BTN2: "btn2",
  BTN3: "btn3",
  BTN4: "btn4",
  BTN5: "btn5",
  BTN6: "btn6",
  BTN7: "btn7",
  BTN8: "btn8",
  BTN9: "btn9",
  BTN0: "btn0",
  BTNPRD: "btn.",
  BTNPLS: "btn+",
  BTNMIN: "btn-",
  BTNMUL: "btn*",
  BTNDIV: "btn/",
  BTNPIP: "btn|",
  BTNCLR: "btnCLR",
  BTNDEL: "btnDEL",
  BTNRTN: "btnRTN",
  BTNMOD: "btnMOD"
}

export const DECIMAL_PRECISION = 15;

type CalculatorAction = {
  payload: {
    type: string,
    input: string | null;
  }
}

type HistoryStackType = {
  currentOperand: string | null, 
  previousOperand: string | null, 
  operation: string | null, 
  inputState: string | null, 
  mode: string | null,
  overwrite: boolean | null, 
}

type CalculatorState = {
  
    inputState: string | null,
    currentOperand: string | null,
    previousOperand: string | null,
    operation: string | null,
    mode: string | null,
    overwrite: boolean | null,
    history: HistoryStackType[],
}

function reducer(state: CalculatorState, payload: CalculatorAction) {
  switch (payload.payload.type) {

    case ACTIONS.KEYPAD:
      switch (state.inputState) {
        case ACTIONS.START:
          return ActionsStart(state, payload);
        case ACTIONS.DIGIT:
          if (!isNaN(parseInt(payload.payload.input!))) {
            SaveHistory(state);
            state.inputState = ACTIONS.DIGIT;
            state.currentOperand = `${state.currentOperand || ""}${payload.payload.input}`;
          } else if (payload.payload.input === '.') {
            SaveHistory(state);
            state.inputState = ACTIONS.PERIOD;
            state.currentOperand = `${state.currentOperand || ""}${payload.payload.input}`;
          } else if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
            SaveHistory(state);
            if (state.previousOperand == null) {
              state.operation = payload.payload.input;
              state.previousOperand = state.currentOperand;
              state.inputState = ACTIONS.START;
              state.currentOperand = null;
              payload.payload.input = null;
            } else {
              state.previousOperand = evaluate(state);
              state.operation = payload.payload.input;
              state.currentOperand = null;
              state.inputState = ACTIONS.START;
              payload.payload.input = null;
            }
          }
          return {
            ...state
          }
        case ACTIONS.NEGATE:
          if (!isNaN(parseInt(payload.payload.input!))) {
            SaveHistory(state);
            state.inputState = ACTIONS.DIGIT;
            return {
              ...state,
              currentOperand: `${state.currentOperand || ""}${payload.payload.input}`,
            }
          }
          return {
            ...state,
          }
        case ACTIONS.FRACTION_NEGATE:
          if (!isNaN(parseInt(payload.payload.input!))) {
            SaveHistory(state);
            state.inputState = ACTIONS.FRACTION_NUMERATOR;
            return {
              ...state,
              currentOperand: `${state.currentOperand || ""}${payload.payload.input}`,
            }
          }
          return {
            ...state,
          }
        case ACTIONS.FRACTION_NUMERATOR:
          if (!isNaN(parseInt(payload.payload.input!)) || payload.payload.input === '|') {
            SaveHistory(state);
            if (payload.payload.input === '|') {
              state.inputState = ACTIONS.PIPE;
            }
            return {
              ...state,
              currentOperand: `${state.currentOperand || ""}${payload.payload.input}`,
            }
          } else if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
            SaveHistory(state);
            if (state.previousOperand == null) {
              state.operation = payload.payload.input;
              state.previousOperand = state.currentOperand;
              state.inputState = ACTIONS.START;
              state.currentOperand = null;
              payload.payload.input = null;
            } else {
              state.previousOperand = evaluateFractions(state);
              state.operation = payload.payload.input;
              state.currentOperand = null;
              state.inputState = ACTIONS.START;
              payload.payload.input = null;
            }
          }
          return {
            ...state,
          }
        case ACTIONS.PIPE:
          if (!isNaN(parseInt(payload.payload.input!))) {
            SaveHistory(state);
            state.inputState = ACTIONS.FRACTION_DENOMINATOR;
            return {
              ...state,
              currentOperand: `${state.currentOperand || ""}${payload.payload.input}`,
            }
          }
          return {
            ...state,
          }
        case ACTIONS.FRACTION_DENOMINATOR:
          if (!isNaN(parseInt(payload.payload.input!))) {
            SaveHistory(state);
            state.inputState = ACTIONS.FRACTION_DENOMINATOR;
            state.currentOperand = `${state.currentOperand || ""}${payload.payload.input}`;
          } else if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
            SaveHistory(state);
            if (state.previousOperand == null) {
              state.operation = payload.payload.input;
              state.previousOperand = state.currentOperand;
              state.inputState = ACTIONS.START;
              state.currentOperand = null;
              payload.payload.input = null;
            } else {
              state.previousOperand = evaluateFractions(state);
              state.operation = payload.payload.input;
              state.currentOperand = null;
              state.inputState = ACTIONS.START;
              payload.payload.input = null;
            }
          }
          return {
            ...state
          }
        case ACTIONS.PERIOD:
          if (!isNaN(parseInt(payload.payload.input!))) {
            SaveHistory(state);
            state.inputState = ACTIONS.PERIOD_DIGITS;
            return {
              ...state,
              currentOperand: `${state.currentOperand || ""}${payload.payload.input}`,
            }
          }
          return {
            ...state,
          }
        case ACTIONS.PERIOD_DIGITS:
          if (!isNaN(parseInt(payload.payload.input!))) {
            SaveHistory(state);
            state.currentOperand = `${state.currentOperand || ""}${payload.payload.input}`;
          } else if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
            SaveHistory(state);
            if (state.previousOperand == null) {
              state.operation = payload.payload.input;
              state.previousOperand = state.currentOperand;
              state.inputState = ACTIONS.START;
              state.currentOperand = null;
            } else {
              state.previousOperand = evaluate(state);
              state.operation = payload.payload.input;
              state.currentOperand = null;
              state.inputState = ACTIONS.START;
            }
          }
          return {
            ...state,
          }
        default:
          return {
            ...state,
          }
      }
    case ACTIONS.CLEAR:
      state.history = [];
      return {
        ...state,
        overwrite: false,
        previousOperand: null,
        operation: null,
        inputState: ACTIONS.START,
        currentOperand: null,
      }
    case ACTIONS.MODE:
      if (state.previousOperand == null && state.currentOperand == null) {
        if (state.mode === '(D)') {
          state.mode = '(F)';
        } else if(state.mode === '(F)') {
          state.mode = '(D)';
        }
      } else if (state.previousOperand == null && state.currentOperand != null) {
        if (state.mode === '(D)' && state.inputState !== ACTIONS.PERIOD) {
          if (parseFloat(state.currentOperand) > 100000.0) {
            return state;
          }
          state.mode = '(F)';
          state.currentOperand = DecimalToFraction(state.currentOperand);
        } else if (state.mode === '(F)' && state.inputState !== ACTIONS.PIPE) {
          state.mode = '(D)';
          let parts = state.currentOperand.split("|");
          let numerator = parseFloat(parts[0]);
          let denominator = 1;
          if (parts[1]) {
            denominator = parseFloat(parts[1]);
          }
          state.currentOperand = RemoveTrailingZeros((numerator / denominator).toPrecision(DECIMAL_PRECISION).toString());

        }
      }
      return {
        ...state,
      }
    case ACTIONS.DELETE_LAST:
      if (state.history.length > 0) {
        //{state.currentOperand, state.previousOperand, state.operation, state.inputState, state.overwrite, state.mode} = state.history.pop();
        let hst = state.history.pop();
        
        state.currentOperand = hst!.currentOperand;
        state.previousOperand = hst!.previousOperand;
        state.operation = hst!.operation;
        state.inputState = hst!.inputState;
        state.mode = hst!.mode;
        state.overwrite = hst!.overwrite;
      


        //[state.currentOperand, state.previousOperand, state.operation, state.inputState, state.overwrite, state.mode] = state.history.pop();
      }
      return {
        ...state,
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.inputState === ACTIONS.PIPE ||
        state.inputState === ACTIONS.PERIOD) {
        return state;
      }
      SaveHistory(state);
      if (state.mode === '(D)') {
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          inputState: ACTIONS.START,
          currentOperand: evaluate(state),
        }
      } else {
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          inputState: ACTIONS.START,
          currentOperand: evaluateFractions(state),
        }
      }

    default:
      return state;
  }
}

function evaluateFractions(state: CalculatorState) {

  let fractionCurrent = new Fraction(state.currentOperand!);
  let fractionPrevious = new Fraction(state.previousOperand!);
  if (!fractionCurrent.getIsValid() || !fractionPrevious.getIsValid()) {
    return "";
  }
  switch (state.operation) {
    case "+":
      fractionPrevious.addFractions(fractionCurrent.get());
      break;
    case "-":
      fractionPrevious.subtractFractions(fractionCurrent.get());
      break;
    case "*":
      fractionPrevious.multiplyFractions(fractionCurrent.get());
      break;
    case "/":
      fractionPrevious.divideFractions(fractionCurrent.get());
      break;
    default:
      return "";
  }
  return fractionPrevious.get();
}

function evaluate(state: CalculatorState) {
  const previous = parseFloat(state.previousOperand!);
  const current = parseFloat(state.currentOperand!);
  if (isNaN(previous) || isNaN(current)) {
    return "";
  }
  let computation = 0;
  switch (state.operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "/":
      computation = previous / current;
      break;
    default:
      break;
  }
  let compStr = computation.toPrecision(DECIMAL_PRECISION).toString();
  return RemoveTrailingZeros(compStr);

}

//function RemoveTrailingZeros(compStr) {
  const RemoveTrailingZeros = (compStr: string) => {
  if (compStr.includes('.') && !(compStr.includes('e') || compStr.includes('E'))) {
    let idx = compStr.length;
    while (compStr.charAt(idx - 1) === '0') {
      compStr = compStr.substring(0, compStr.length - 1);
      idx = idx - 1;
    }
    if (compStr.charAt(compStr.length - 1) === '.') {
      compStr = compStr.substring(0, compStr.length - 1);
    }
    return compStr;
  }
  return compStr;
}

function ActionsStart(state: CalculatorState, payload: CalculatorAction) {
  // have done evaluate that sets overwrite and clears previous and operation.
  // now we see an operation. push current to previous, clear current and set
  // operation.
  if (state.overwrite) {
    if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
      SaveHistory(state);
      state.previousOperand = state.currentOperand;
      state.operation = payload.payload.input;
      state.currentOperand = null;
      state.inputState = ACTIONS.START;
      state.overwrite = false;
      return {
        ...state,
      }
    }
  }
  if (!isNaN(parseInt(payload.payload.input!))) {
    SaveHistory(state);
    // have done evaluate that sets overwrite and clears previous and operation.
    // now we see a digit so clear the current and turn off overwrite.
    if (state.overwrite) {
      state.currentOperand = null;
      state.overwrite = false;
    }
    if (state.mode === '(D)') {
      if (!isNaN(parseInt(payload.payload.input!))) {
        state.inputState = ACTIONS.DIGIT;
      } else {
        state.inputState = ACTIONS.NEGATE;
      }
    }
    if (state.mode === '(F)') {
      if (!isNaN(parseInt(payload.payload.input!))) {
        state.inputState = ACTIONS.FRACTION_NUMERATOR;
      } else {
        state.inputState = ACTIONS.FRACTION_NEGATE;
      }
    }
    state.currentOperand = `${state.currentOperand || ""}${payload.payload.input}`;
  }
  return {
    ...state,
  }
}

function SaveHistory(state: CalculatorState) {
  let hst = {
    currentOperand: state.currentOperand,
    previousOperand: state.previousOperand,
    operation: state.operation,
    mode: state.mode,
    inputState: state.inputState,
    overwrite: state.overwrite,
  }
  state.history.push(hst);
  //state.history.push([state.currentOperand, state.previousOperand, state.operation, state.inputState, state.overwrite, state.mode]);
}


function App() {

  useEffect(() => {
    const detectKeyDown = (e: any) => {
      switch (e.key) {
        case "0":
          ButtonClick(KEYS.BTN0);
          break;
        case "1":
          ButtonClick(KEYS.BTN1);
          break;
        case "2":
          ButtonClick(KEYS.BTN2);
          break;
        case "3":
          ButtonClick(KEYS.BTN3);
          break;
        case "4":
          ButtonClick(KEYS.BTN4);
          break;
        case "5":
          ButtonClick(KEYS.BTN5);
          break;
        case "6":
          ButtonClick(KEYS.BTN6);
          break;
        case "7":
          ButtonClick(KEYS.BTN7);
          break;
        case "8":
          ButtonClick(KEYS.BTN8);
          break;
        case "9":
          ButtonClick(KEYS.BTN9);
          break;
        case ".":
          ButtonClick(KEYS.BTNPRD);
          break;
        case "+":
          ButtonClick(KEYS.BTNPLS);
          break;
        case "-":
          ButtonClick(KEYS.BTNMIN);
          break;
        case "*":
          ButtonClick(KEYS.BTNMUL);
          break;
        case "/":
          ButtonClick(KEYS.BTNDIV);
          break;
        case "|":
          ButtonClick(KEYS.BTNPIP);
          break;
        case "d":
        case "D":
        case "Delete":
        case "Backspace":
          ButtonClick(KEYS.BTNDEL);
          break;
        case "c":
        case "C":
          ButtonClick(KEYS.BTNCLR);
          break;
        case "Enter":
          ButtonClick(KEYS.BTNRTN);
          break;
        case "\\":
        case "m":
        case "M":
          ButtonClick(KEYS.BTNMOD);
          break;
        default:
          break;
      }
    }
    document.addEventListener('keydown', detectKeyDown, true);
  }, [])


  function ButtonClick(id: string) {
    let buttonClick = document.getElementById(id);
    buttonClick?.click();
  }



  const initialState: CalculatorState = {
    overwrite: false,
    currentOperand: null,
    previousOperand: null,
    operation: null,
    mode: "(D)",
    inputState: ACTIONS.START,
    history: [],
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const { currentOperand, previousOperand, operation, mode } = state;

const btnMOD: CalculatorAction = {
  payload: {
    type: ACTIONS.MODE,
    input: null,
  }
}

const btnCLEAR: CalculatorAction = {
  payload: {
    type: ACTIONS.CLEAR,
    input: null,
  }
}

const btnDEL: CalculatorAction = {
  payload: {
    type: ACTIONS.DELETE_LAST,
    input: null,
  }
}

const btnEVAL: CalculatorAction = {
  payload: {
    type: ACTIONS.EVALUATE,
    input: null,
  }
}

  return (
    <div className="calculator-grid">
      <div className="output">

        <div className="previous-operand">{mode} {previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>

      </div>

      <button id="btnMOD" onClick={() => dispatch(btnMOD)}>F/D</button>
      <button id="btnCLR" onClick={() => dispatch(btnCLEAR)}>AC</button>
      <button id="btnDEL" onClick={() => dispatch(btnDEL)}>DEL</button>
      <InputButton id="btn/" input="/" dispatch={dispatch} />
      <InputButton id="btn1" input="1" dispatch={dispatch} />
      <InputButton id="btn2" input="2" dispatch={dispatch} />
      <InputButton id="btn3" input="3" dispatch={dispatch} />
      <InputButton id="btn*" input="*" dispatch={dispatch} />
      <InputButton id="btn4" input="4" dispatch={dispatch} />
      <InputButton id="btn5" input="5" dispatch={dispatch} />
      <InputButton id="btn6" input="6" dispatch={dispatch} />
      <InputButton id="btn+" input="+" dispatch={dispatch} />
      <InputButton id="btn7" input="7" dispatch={dispatch} />
      <InputButton id="btn8" input="8" dispatch={dispatch} />
      <InputButton id="btn9" input="9" dispatch={dispatch} />
      <InputButton id="btn-" input="-" dispatch={dispatch} />
      <InputButton id="btn." input="." dispatch={dispatch} />
      <InputButton id="btn0" input="0" dispatch={dispatch} />
      <InputButton id="btn|" input="|" dispatch={dispatch} />

      <button id="btnRTN" onClick={() => dispatch(btnEVAL)}>=</button>

    </div>
  )
}



export default App;
