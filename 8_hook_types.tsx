import * as b from "bobril";
import { observable } from "bobx";
import { IOptions } from "./options";

function StateHook() {
    const [count, setCount] = b.useState(0);
    return (
        <div onClick={() => {
            setCount(count + 1);
            // alternative
            // setCount(c => c + 1)
            return true;
        }}>
            {count}
        </div>
    )
}

// all you need for handling lifecycle
function EffectHooks() {
    b.useLayoutEffect(() => {
        console.log("layoutEffect");
    }, []);
    b.useEffect(() => {
        console.log("effect");
        // dispose
        return () => console.log("destroy")
    }, []);

    return (
        <div>
            effects
        </div>
    )
}

function RefHook() {
    const obj1 = {text: "ahoj"};
    // variabla ulozena v pameti
    const obj2 = b.useRef({text: "ahoj"});

    const domRef = b.useRef<b.IBobrilCacheNode>();

    return (
        <div ref={domRef}>
            {obj1.text}
            {obj2.current.text}
        </div>
    )
}

class BobxStore {
    @observable
    x: number = 0;
}

function StoreHook() {
    const store = b.useStore(() => new BobxStore());

    return (
        <div>
            {store.x}
        </div>
    )
}

interface IData {
    x: number;
}

// bacha v reactu memoizuje vysledek funkce na zaklade deps, v bobrilu jen invaliduje
function MemoHook(data: IData): b.IBobrilNode {
    // v podstate ref s invalidaci na zaklade dependenci
    // optimalizace
    return b.useMemo(() => <div>{data.x}</div>, [data.x]);
}


// made for cooperate with bobril context api
const context = b.createContext({
    text: "nothing"
});
function ContextConsumerHook() {
    const { text } = b.useContext(context);
    return (
        <>
            { text }
        </>
    )
}

function ContextProviderHook(data: {children: b.IBobrilNode}) {
    b.useProvideContext(context, {
        text: "text from context"
    });
    return (
        <div>
            {data.children}
        </div>
    )
}

function WrapUp() {
    return (
        <>
            <ContextConsumerHook/>
            <ContextProviderHook>
                <ContextConsumerHook/>
            </ContextProviderHook>
        </>
    )
}

function Counter() {
    const [count, setCount] = b.useState(0);
    const [timeout, setTimeout] = b.useState(1000);

    // implement timeout for gotchas
    return (
        <div>
            {count}
            <div>
                <label>Timeout for counter:</label><input value={timeout} onChange={setTimeout} type="range" min={100} max={2000} step={100} stepList="steplist"/>
                <span style={{paddingLeft: 10}}>{timeout}</span>
            </div>
            <div onClick={() => {
                setCount(count + 1);
                return true;
            }}>+</div>
            <div onClick={() => {
                setCount(count - 1);
                return true;
            }}>-
            </div>
        </div>
    )
}

export const options: IOptions = {
    name: "hook types",
    options: [
        ["useState", () => <StateHook/>],
        ["useEffect & useLayoutEffect", () => <EffectHooks/>],
        ["useRef", () => <RefHook/>],
        ["useStore", () => <StoreHook/>],
        ["useMemo", () => <MemoHook x={1}/>],
        ["useContext", () => <WrapUp/>],
        ["Counter", () => <Counter/>],
    ]
};
