

import { useEffect, useReducer } from 'react';
import { DecimalToFraction, Fraction } from './components/FractionUtils';
import { ACTIONS, CalculatorAction, CalculatorState } from './components/CalculatorTypes';
import { DECIMAL_PRECISION } from './components/CalculatorTypes';
import { ButtonScreen } from './components/ButtonScreen';
import './styles.css';



function reducer(state: CalculatorState, payload: CalculatorAction) {
  switch (payload.payload.type) {

    case ACTIONS.KEYPAD:
      switch (state.inputState) {
        case ACTIONS.START:
          return ActionsStart(state, payload);
        case ACTIONS.DIGIT:
          if (!isNaN(parseInt(payload.payload.input!))) {
            state = ActionInputStateCurrentOperand(state, payload, ACTIONS.DIGIT);
          } else if (payload.payload.input === '.') {
            state = ActionInputStateCurrentOperand(state, payload, ACTIONS.PERIOD);
          } else if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
            state = ActionOperatorEval(state, payload, 'decimal');
          }
          return {
            ...state,
          }
        case ACTIONS.NEGATE:
          state = ActionNegatePipePeriod(state, payload, ACTIONS.DIGIT);
          return {
            ...state,
          }
        case ACTIONS.FRACTION_NEGATE:
          if (!isNaN(parseInt(payload.payload.input!))) {
            state = ActionNegatePipePeriod(state, payload, ACTIONS.FRACTION_NUMERATOR);
          }
          return {
            ...state,
          }
        case ACTIONS.FRACTION_NUMERATOR:
          if (!isNaN(parseInt(payload.payload.input!)) || payload.payload.input === '|') {
            SaveHistory(state);
            state.currentOperand = `${state.currentOperand || ""}${payload.payload.input}`;
            if (payload.payload.input === '|') {
              state.inputState = ACTIONS.PIPE;
            }
          } else if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
            state = ActionOperatorEval(state, payload, 'fraction');
          }
          return {
            ...state,
          }
        case ACTIONS.PIPE:
          state = ActionNegatePipePeriod(state, payload, ACTIONS.FRACTION_DENOMINATOR);
          return {
            ...state,
          }
        case ACTIONS.FRACTION_DENOMINATOR:
          if (!isNaN(parseInt(payload.payload.input!))) {
            state = ActionInputStateCurrentOperand(state, payload, ACTIONS.FRACTION_DENOMINATOR);
          } else if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
            state = ActionOperatorEval(state, payload, 'fraction');
          }
          return {
            ...state
          }
        case ACTIONS.PERIOD:
          state = ActionNegatePipePeriod(state, payload, ACTIONS.PERIOD_DIGITS);
          return {
            ...state,
          }
        case ACTIONS.PERIOD_DIGITS:
          if (!isNaN(parseInt(payload.payload.input!))) {
            SaveHistory(state);
            state.currentOperand = `${state.currentOperand || ""}${payload.payload.input}`;
          } else if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
            state = ActionOperatorEval(state, payload, 'decimal');
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
        } else if (state.mode === '(F)') {
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
        let hst = state.history.pop();
        state.currentOperand = hst!.currentOperand;
        state.previousOperand = hst!.previousOperand;
        state.operation = hst!.operation;
        state.inputState = hst!.inputState;
        state.mode = hst!.mode;
        state.overwrite = hst!.overwrite;
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
        state.currentOperand = evaluate(state);
      } else {
        state.currentOperand = evaluateFractions(state);
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        inputState: ACTIONS.START,
      }
    case ACTIONS.HIDE_KEYPAD:
      if (state.hideKeypad) {
        state.hideKeypad = false;
      } else {
        state.hideKeypad = true;
      }
      return {
        ...state
      }
    default:
      return state;
  }
}


function ActionInputStateCurrentOperand(state: CalculatorState, payload: CalculatorAction, nextState: string) {
  SaveHistory(state);
  state.inputState = nextState;
  return {
    ...state,
    currentOperand: `${state.currentOperand || ""}${payload.payload.input}`,
  }
}
function ActionNegatePipePeriod(state: CalculatorState, payload: CalculatorAction, nextState: string) {
  if (!isNaN(parseInt(payload.payload.input!))) {
    SaveHistory(state);
    state.inputState = nextState;
    return {
      ...state,
      currentOperand: `${state.currentOperand || ""}${payload.payload.input}`,
    }
  }
  return {
    ...state,
  }
}

function ActionOperatorEval(state: CalculatorState, payload: CalculatorAction, evalType: string) {
  SaveHistory(state);
  if (state.previousOperand == null) {
    state.operation = payload.payload.input;
    state.previousOperand = state.currentOperand;
    state.inputState = ACTIONS.START;
    state.currentOperand = null;
    payload.payload.input = null;
  } else {
    if (evalType === 'decimal') {
      state.previousOperand = evaluate(state);
    } else if (evalType === 'fraction') {
      state.previousOperand = evaluateFractions(state);
    }
    state.operation = payload.payload.input;
    state.currentOperand = null;
    state.inputState = ACTIONS.START;
    payload.payload.input = null;
  }
  return {
    ...state
  }
}

function ActionsStart(state: CalculatorState, payload: CalculatorAction) {
  // Note: The overwrite flag should have been named something like
  // overwriteCurrentOperand. After an evaluation has occured we will always
  // be overwriting the current with a new input character in this state
  // but we may have pushed current to previous setting the operation
  // before overwriting the current. These operation are described below.
  if (state.overwrite) {
    if (payload.payload.input === '-' || payload.payload.input === '+' || payload.payload.input === '*' || payload.payload.input === '/') {
      // Evaluate sets the overwrite flag true and places the evaluated answer
      // in current after clearing previous and the operation. Now we see
      // an operation so push the current to previous, set the operation, 
      // clear the current and set overwrite to false. We are leaving
      // the state set to ActionStart waiting for an new character that
      // can be either a digit or the - sign signaling a negative current
      // value to come. The first digit in the ActionStart state will be
      // handled by the next if condition in this method.
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
  if (!isNaN(parseInt(payload.payload.input!)) || payload.payload.input === '-') {
    // We are here waiting for the first character of an expression to be
    // typed that can be either a digit or a - sign. If it's a - sign set
    // the state to a NEGATE (either decimal or fraction) which will start
    // accepting future digits. If it's a digit set the state to a DIGIT
    // state (either decimal or fraction) which will accept future digits.
    // In either case save the first character in current before moving
    // control to the next state.
    // The overwrite flag may be set entering this if condition if the 
    // payload contains a digit next character after an evaluation.
    // Regardless we want it reset and current cleared before accepting
    // a new current first character.
    SaveHistory(state);
    state.overwrite = false;
    state.currentOperand = null;
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
}

function evaluateFractions(state: CalculatorState) {
  let fractionCurrent = new Fraction(state.currentOperand!);
  let fractionPrevious = new Fraction(state.previousOperand!);
  if (!fractionCurrent.getIsValid() || !fractionPrevious.getIsValid()) {
    return "error";
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
    return "error";
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

function RemoveTrailingZeros(compStr: string) {
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



function App() {

  useEffect(() => {
    const detectKeyDown = (e: any) => {
      switch (e.key) {
        case "0":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "0" } });
          break;
        case "1":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "1" } });
          break;
        case "2":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "2" } });
          break;
        case "3":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "3" } });
          break;
        case "4":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "4" } });
          break;
        case "5":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "5" } });
          break;
        case "6":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "6" } });
          break;
        case "7":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "7" } });
          break;
        case "8":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "8" } });
          break;
        case "9":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "9" } });
          break;
        case ".":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "." } });
          break;
        case "+":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "+" } });
          break;
        case "-":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "-" } });
          break;
        case "*":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "*" } });
          break;
        case "/":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "/" } });
          break;
        case "|":
          dispatch({ payload: { type: ACTIONS.KEYPAD, input: "|" } });
          break;
        case "k":
        case "K":
          dispatch({ payload: { type: ACTIONS.HIDE_KEYPAD, input: null } });
          break;
        case "d":
        case "D":
        case "Delete":
        case "Backspace":
          dispatch({ payload: { type: ACTIONS.DELETE_LAST, input: null } });
          break;
        case "c":
        case "C":
          dispatch({ payload: { type: ACTIONS.CLEAR, input: null } });
          break;
        case "Enter":
          dispatch({ payload: { type: ACTIONS.EVALUATE, input: null } });
          break;
        case "\\":
        case "m":
        case "M":
          dispatch({ payload: { type: ACTIONS.MODE, input: null } });
          break;
        default:
          break;
      }
    }
    document.addEventListener('keydown', detectKeyDown, true);
  }, [])


  const initialState: CalculatorState = {
    hideKeypad: false,
    overwrite: false,
    currentOperand: null,
    previousOperand: null,
    operation: null,
    mode: "(D)",
    inputState: ACTIONS.START,
    history: [],
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const { currentOperand, previousOperand, operation, mode, hideKeypad } = state;



  return (
    <div className="calculator-grid">
      <div className="output">

        <div className="previous-operand">{mode} {previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>

      </div>

      {hideKeypad ? (
        <>
          {/* <ButtonScreen dispatch={dispatch} /> */}
        </>
      )
        : (
          <>
            <ButtonScreen dispatch={dispatch} />
          </>
        )}


    </div>
  )
}



export default App;
