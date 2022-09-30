
import React from 'react';
import InputButton from './InputButton';

import { btnMOD, btnCLEAR, btnDEL, btnEVAL } from './CalculatorTypes';
import { CalculatorAction } from './CalculatorTypes';


type ButtonScreenProps = {
    dispatch: React.Dispatch<CalculatorAction>
}

export function ButtonScreen(props: ButtonScreenProps) {
    return (
        <>
            <button id="btnMOD" onClick={() => props.dispatch(btnMOD)}>F/D</button>
            <button id="btnCLR" onClick={() => props.dispatch(btnCLEAR)}>AC</button>
            <button id="btnDEL" onClick={() => props.dispatch(btnDEL)}>DEL</button>
            <InputButton id="btn/" input="/" dispatch={props.dispatch} />
            <InputButton id="btn1" input="1" dispatch={props.dispatch} />
            <InputButton id="btn2" input="2" dispatch={props.dispatch} />
            <InputButton id="btn3" input="3" dispatch={props.dispatch} />
            <InputButton id="btn*" input="*" dispatch={props.dispatch} />
            <InputButton id="btn4" input="4" dispatch={props.dispatch} />
            <InputButton id="btn5" input="5" dispatch={props.dispatch} />
            <InputButton id="btn6" input="6" dispatch={props.dispatch} />
            <InputButton id="btn+" input="+" dispatch={props.dispatch} />
            <InputButton id="btn7" input="7" dispatch={props.dispatch} />
            <InputButton id="btn8" input="8" dispatch={props.dispatch} />
            <InputButton id="btn9" input="9" dispatch={props.dispatch} />
            <InputButton id="btn-" input="-" dispatch={props.dispatch} />
            <InputButton id="btn." input="." dispatch={props.dispatch} />
            <InputButton id="btn0" input="0" dispatch={props.dispatch} />
            <InputButton id="btn|" input="|" dispatch={props.dispatch} />

            <button id="btnRTN" onClick={() => props.dispatch(btnEVAL)}>=</button>


        </>
    )
}