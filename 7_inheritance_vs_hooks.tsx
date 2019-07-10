import * as b from "bobril";
import { observable } from "bobx";
import { IOptions } from "./options";
import {IBobrilCacheNode} from "bobril";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

// mixins

type WidthHeight = {
    width: number;
    height: number;
}

interface Measured {
    size: WidthHeight;
}

interface IContext extends b.IBobrilCtx {
    size: WidthHeight;
}

const Mixed = b.createComponent({
    render(ctx: IContext, me: b.IBobrilNodeCommon) {
        me.children = (
            <div style={{width: "100%"}}>
                <h2>Old Mixin</h2>
                <div>Measured div</div>
                <div>width: {ctx.size.width}</div>
            </div>
        )
    }
});

const OldMixin = b.createDerivedComponent(Mixed, {
    init(ctx: IContext) {
        ctx.size = {
            width: 0,
            height: 0
        };
    },
    postUpdateDomEverytime(ctx: IContext, me: b.IBobrilCacheNode): void {
        const { width, height } = (b.getDomNode(me) as Element).getBoundingClientRect();
        if (ctx.size.width !== width || ctx.size.height !== height) {
            ctx.size.width = width;
            ctx.size.height = height;
            b.invalidate(ctx);
        }
    }
});

class Meter extends b.Component  {
    currentSize: WidthHeight;
    postRenderDom() {
        const { width, height } = (b.getDomNode(this.me) as Element).getBoundingClientRect();
        this.currentSize.width = width;
        this.currentSize.height = height;
    }
}

class TestComponent extends b.Component {
    @observable
    currentSize: WidthHeight  = {
        width: 0,
        height: 0
    };

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

function TestOldMixin() {
    return <OldMixin/>
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
function withSize<T extends Measured>(Wrapping: b.IComponentFactory<T>) {
    return class WithEmitterHoc extends b.Component<Omit<T, keyof Measured>>{
        // invalidate and measure me not external thing
        currentSize: WidthHeight = {
            width: 0,
            height: 0
        };

        postRenderDom(me: IBobrilCacheNode): void {
            const { width, height } = (b.getDomNode(this.me) as Element).getBoundingClientRect();
            if(width !== this.currentSize.width || height !== this.currentSize.height) {
                this.currentSize = {
                    width,
                    height
                };
                b.invalidate(this);
            }
        }

        render(data): b.IBobrilNode {
            return <Wrapping
                size={this.currentSize} {...data}/>
        }
    }
}

class T extends b.Component<Measured> {
    @observable.ref
    currentSize: WidthHeight = {
        width: 0,
        height: 0
    };

    render() {
        return (
            <div style={{width: "100%"}}>
                <h2>HOC</h2>
                <div>Measured div</div>
                <div>width: {this.data.size.width}</div>
            </div>
        )
    }
}

export const TestComponent2 = withSize((data) => <T {...data}/>);
// export const TestComponent2 = withSize(b.component(T));

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
                            <h2>Render props</h2>
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
            <h2>Hooks</h2>
            <div>Measured div</div>
            <div>width: {width}</div>
        </div>
    )
}

function Group() {
    return (
        <>
            <TestOldMixin/>
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
