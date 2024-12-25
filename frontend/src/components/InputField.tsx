import {clsx} from "clsx";
import {createSignal, Switch, Match} from "solid-js";
import {FiEye, FiEyeOff} from "solid-icons/fi";

const InputField = (props: any) => {
    const [showPassword, setShowPassword] = createSignal(false)
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
            <div class={clsx("container w-full px-1 flex items-center text-xl border-2",
                {
                    "border-red-400": !props.inputData()[props.input]["valid"],
                    "border-transparent": props.inputData()[props.input]["valid"]
                })}>
                <label for={props.input}><props.Icon class="mr-1"/></label>
                <Switch>
                    <Match when={props.inputType !== "password"}>
                        <input onInput={(event) => updateInputData(event, props.input)}
                               value={props.inputData()[props.input]["value"]}
                               type={props.inputType} id={props.input} class="bg-transparent outline-none"
                               placeholder={props.input}
                        />
                    </Match>
                    <Match when={props.inputType === "password"}>
                        <input onInput={(event) => updateInputData(event, props.input)}
                               value={props.inputData()[props.input]["value"]}
                               type={showPassword() ? "text" : "password"} id={props.input} class="bg-transparent outline-none"
                               placeholder={props.input}
                        />
                        <button type={"button"} onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)}>
                            {showPassword() ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </Match>
                </Switch>
            </div>
            <h1 class="text-md">{props.inputData()[props.input]["message"]}</h1>
        </>
    )
}

export default InputField