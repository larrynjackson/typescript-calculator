

import { ACTIONS } from './App';

type InputButtonProps = {
    id: string,
    input: string,
    dispatch: Function,
}


export default function InputButton(props: InputButtonProps) {
    return (
        <button id={props.id} onClick={() => props.dispatch({ payload: { type: ACTIONS.KEYPAD, input: props.input } })}>
            {props.input}
        </button >
    )
}
