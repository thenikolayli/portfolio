import {createEffect, createSignal} from "solid-js";
import {clsx} from "clsx";

const FlashWord = ({baseProps, word, showArray, showIndex}: {baseProps: any, word: string, showArray: any, showIndex: number}) => {
    const [show, setShow] = createSignal(0)

    createEffect(async () => {
        if (showArray()[showIndex] && show() !== 2) {
            setShow(1)
            await new Promise(resolve => setTimeout(resolve, 50))
            setShow(2)
        }
    })

    return (
        <h1 class={clsx("w-fit mr-2 text-" + baseProps.size, {
            "text-transparent": show() === 0,
            ["bg-" + baseProps.bgcolor]: show() === 1,
            ["text-" + baseProps.textcolor]: show() === 2,
        })}>{word}</h1>
    )
}

export default FlashWord