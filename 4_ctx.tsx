import * as b from "bobril";
import { IOptions } from "./options";
import { observable } from "bobx";

interface ICtx extends b.IBobrilCtx {
  data: {};
  counter: number;
}

const Counter1 = b.createComponent({
  id: "Counter1",

  init(ctx: ICtx) {
    ctx.counter = 0;
  },

  render(ctx: ICtx, me: b.IBobrilNode) {
    me.children = (
      <>
        Counter: {ctx.counter}
        <input
          type="button"
          value="+"
          onClick={() => {
            ctx.counter++;
            b.invalidate(ctx);
            return true;
          }}
        />
      </>
    );
  }
});

//-----------------------------------

class Counter2 extends b.Component {
  counter = 0;

  render() {
    return (
      <>
        Counter: {this.counter}
        <input
          type="button"
          value="+"
          onClick={() => {
            this.counter++;
            b.invalidate(this);
            return true;
          }}
        />
      </>
    );
  }
}

//-----------------------------------

class Counter2Alt extends b.Component {
  @observable counter = 0;

  render() {
    return (
      <>
        Counter: {this.counter}
        <input
          type="button"
          value="+"
          onClick={() => {
            this.counter++;
            return true;
          }}
        />
      </>
    );
  }
}

//-----------------------------------

class CtxStore extends b.BobrilCtx<{}> {
  @observable counter = 0;
  constructor(data: {}, me: b.IBobrilCacheNode) {
    super(data, me);
  }
  // further logic
}

class Counter2Alt2 extends b.Component<{}> {
  ctxClass: CtxStore;
  render(ctx: CtxStore) {
    return (
      <>
        Counter: {ctx.counter}
        <input
          type="button"
          value="+"
          onClick={() => {
            ctx.counter++;
            return true;
          }}
        />
      </>
    );
  }
}

//-----------------------------------

// useState hook - get / set
function Counter3() {
  const [counter /*number*/, setCounter] = b.useState(0);
  return (
    <>
      Counter: {counter}
      <input
        type="button"
        value="+"
        onClick={() => {
          setCounter(counter + 1);
          // alt: setCounter(c => c + 1);
          return true;
        }}
      />
    </>
  );
}

// useState hook - iprop - usable for instance in input value
function Counter3Alt() {
  const counter: b.IProp<number> = b.useState(0);
  return (
    <>
      Counter: {counter()}
      <input
        type="button"
        value="+"
        onClick={() => {
          counter(counter() + 1);
          return true;
        }}
      />
    </>
  );
}

// https://reactjs.org/docs/hooks-reference.html

//-----------------------------------

export const options: IOptions = {
  name: "Ctx (Counter)",
  options: [
    ["createComponent", Counter1],
    ["class field", b.component(Counter2)],
    ["class observable", b.component(Counter2Alt)],
    ["class store", b.component(Counter2Alt2)],
    ["functional useState get/set", b.component(Counter3)],
    ["functional useState IProp", b.component(Counter3Alt)]
  ]
};
