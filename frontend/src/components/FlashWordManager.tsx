import {createEffect, createSignal} from "solid-js";
import FlashWord from "./FlashWord.tsx";

const FlashWordManager = ({baseProps, words, showSignal}: {baseProps: any, words: string, showSignal: any}) => {
    let wordArray = words.split(" ")
    const filteredWordArray = []
    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] !== "" && wordArray[i] !== "\n") {
            filteredWordArray.push(wordArray[i])
        }
    }
    wordArray = [...filteredWordArray]

    const [showArray, setShowArray] = createSignal(Array(wordArray.length).fill(false))

    createEffect(async () => {
        if (showSignal()) {
            let index = 0

            const showArrayLoop = setInterval(() => {
                if (index >= showArray().length) {
                    clearInterval(showArrayLoop)
                    return
                }

                let newShowArray = [...showArray()]
                newShowArray[index] = true
                setShowArray(newShowArray)
                index++
            }, 200)
        }
    })

    return (
        wordArray.map((word, index) => (
            <FlashWord baseProps={baseProps} word={word} showArray={showArray} showIndex={index} />
        ))
    )
}

export default FlashWordManager