import {clsx} from "clsx";

const InputField = (props: any) => {
    const updateInputData = (event: any, key: any) => {
        let newInputData = {...props.inputData()}
        newInputData[key]["value"] = event.target.value;

        if (newInputData[key]["value"] == "") {
            newInputData[key]["valid"] = false
            newInputData[key]["message"] = key + " required"
        } else {
            newInputData[key]["valid"] = true
            newInputData[key]["message"] = ""
        }

        props.setInputData(newInputData);
    }

    return (
        <>
            <div class={clsx("container w-fit flex items-center text-xl border-2",
                {
                    "border-red-400": !props.inputData()[props.input]["valid"],
                    "border-transparent": props.inputData()[props.input]["valid"]
                })}>
                <label for={props.input}><props.Icon class="mr-1"/></label>
                <input onInput={(event) => updateInputData(event, props.input)}
                       value={props.inputData()[props.input]["value"]}
                       type={props.inputType} id={props.input} class="bg-transparent outline-none"
                       placeholder={props.input}/>
            </div>
            <h1 class="text-md">{props.inputData()[props.input]["message"]}</h1>
        </>
    )
}

export default InputField