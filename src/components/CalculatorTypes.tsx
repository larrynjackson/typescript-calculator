

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
    FRACTION_DENOMINATOR: 'fraction-denominator',
    HIDE_KEYPAD: 'hide-keypad'
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
  
  export type CalculatorAction = {
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
  
  export type CalculatorState = {
    hideKeypad: boolean | null,
    inputState: string | null,
    currentOperand: string | null,
    previousOperand: string | null,
    operation: string | null,
    mode: string | null,
    overwrite: boolean | null,
    history: HistoryStackType[],
  }

  export const btnMOD: CalculatorAction = {
    payload: {
      type: ACTIONS.MODE,
      input: null,
    }
  }

  export const btnCLEAR: CalculatorAction = {
    payload: {
      type: ACTIONS.CLEAR,
      input: null,
    }
  }

  export const btnDEL: CalculatorAction = {
    payload: {
      type: ACTIONS.DELETE_LAST,
      input: null,
    }
  }

  export const btnEVAL: CalculatorAction = {
    payload: {
      type: ACTIONS.EVALUATE,
      input: null,
    }
  }