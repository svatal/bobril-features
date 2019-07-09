/*
import * as b from "bobril";
import { observable } from "bobx";
import { IOptions } from "./options";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

// mixins

type WidthHeight = {
    width: number;
    height: number;
}

interface Measure {
    measure(me: b.IBobrilCacheNode): WidthHeight;
}

// dopsat

b.createDerivedComponent()

class Meter implements Measure {
    @observable.ref
    currentSize: WidthHeight = {
        width: 0,
        height: 0
    };
    measure(me: b.IBobrilCacheNode): WidthHeight {
        const { width, height } = (b.getDomNode(me) as Element).getBoundingClientRect();
        return {
            width,
            height
        }
    }
}

// change
class TestComponent extends b.Component implements Measure {

    // same as hoc
    postRenderDom(me: b.IBobrilCacheNode): void {
        this.currentSize = this.measure(me);
    }

    measure(me: b.IBobrilCacheNode): WidthHeight {return {width: 0, height: 0}}

    render() {
        return (
            <div style={{width: "100%"}}>
                <h2>Mixin</h2>
                <div>Measured div</div>
                <div>width: {this.currentSize.width}</div>
            </div>
        )
    }
}
applyMixins(TestComponent, [Meter]);

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}

function Mixin() {
    return <TestComponent/>
}

// inheritance
class Measure1 extends b.Component {
    @observable
    currentSize: WidthHeight = {
        width: 0,
        height: 0
    };
    postRenderDom(me: b.IBobrilCacheNode): void {
        const { width, height } = (b.getDomNode(me) as Element).getBoundingClientRect();
        this.currentSize.width = width;
        this.currentSize.height = height;
    }
}

export class TestComponent1 extends Measure1 {
    render(): b.IBobrilNode {
        return (
            <div style={{width: "100%"}}>
                <h2>Class inheritance</h2>
                <div>Measured div</div>
                <div>width: {this.currentSize.width}</div>
            </div>
        )
    }
}

// HOC
function withSize<T extends Measure>(Wrapping: b.IComponentFactory<T>) {
    return class WithEmitterHoc extends b.Component<Omit<T, keyof Measure>>{
        // invalidate and measure me not external thing

        measure(): WidthHeight {
            const { width, height } = (b.getDomNode(this.me) as Element).getBoundingClientRect();
            return {
                width,
                height
            }
        }
        render(data): b.IBobrilNode {
            return <Wrapping
                size={}
                measure={() => this.measure()} {...data}/>
        }
    }
}

class T extends b.Component<Measure> {
    @observable.ref
    currentSize: WidthHeight = {
        width: 0,
        height: 0
    };

    postRenderDom(me: b.IBobrilCacheNode): void {
        this.currentSize = this.data.measure(me);
    }

    render() {
        return (
            <div style={{width: "100%"}}>
                <h2>HOC</h2>
                <div>Measured div</div>
                <div>width: {this.currentSize.width}</div>
            </div>
        )
    }
}

export const TestComponent2 = withSize(b.component(T));
export const TestComponentX = withSize((data: Measure) => <T {...data}/>);

interface IData {
    children(size: WidthHeight): b.IBobrilNode;
}

class WithSize extends b.Component<IData> {
    @observable
    currentSize: WidthHeight = {
        width: 0,
        height: 0
    };
    postRenderDom(me: b.IBobrilCacheNode): void {
        const { width, height } = (b.getDomNode(me) as Element).getBoundingClientRect();
        this.currentSize.width = width;
        this.currentSize.height = height;
    }
    render(): b.IBobrilNode {
        return this.data.children(this.currentSize);
    }
}

export function TestComponent3() {
    return (
        <>
            <WithSize>
                {(({width}) =>
                        <div style={{width: "100%"}}>
                            <div>Measured div</div>
                            <div>width: {width}</div>
                        </div>
                    )}
            </WithSize>
        </>
    )
}

// hooks
function useMeter(ref: {current: b.IBobrilCacheNode}) {
    const [width, setWidth] = b.useState(0);
    const [height, setHeight] = b.useState(0);
    //const [size, setSize] = b.useState({width: 0, height: 0});
    b.useLayoutEffect(() => {
        const { width, height } = (b.getDomNode(ref.current) as Element).getBoundingClientRect();
        // setSize({width, height})
        setWidth(width);
        setHeight(height);
    });
    return {
        width,
        height
    }
}

function TestComponent4() {
    const ref = b.useRef<b.IBobrilCacheNode>();
    const { width } = useMeter(ref);

    return (
        <div ref={ref} style={{width: "100%"}}>
            <div>Measured div</div>
            <div>width: {width}</div>
        </div>
    )
}

function Group() {
    return (
        <>
            <Mixin/>
            <TestComponent1/>
            <TestComponent2/>
            <TestComponent3/>
            <TestComponent4/>
        </>
    )
}

export const options: IOptions = {
    name: "evolution of code share (WidthGetter)",
    options: [
        ["", () => <Group/>],
    ]
};
*/
