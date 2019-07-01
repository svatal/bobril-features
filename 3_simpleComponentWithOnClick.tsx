import * as b from "bobril";
import { IOptions } from "./options";

interface IData {
  onClickCallback: (button: number) => boolean;
}

//-----------------------------------

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

export const SimpleComponentWithOnClick1 = b.createComponent<IData>({
  id: "SimpleComponentWithOnClick1",

  render(ctx: ICtx, me: b.IBobrilNode) {
    me.children = "Hello world!";
  },
  onClick(ctx: ICtx, event: b.IBobrilMouseEvent) {
    return ctx.data.onClickCallback(event.button);
  }
});

//-----------------------------------

class SimpleComponentWithOnClick2 extends b.Component<IData> {
  static id = "SimpleComponentWithOnClick2";

  render() {
    return <div>Hello world!</div>;
  }
  onClick(event: b.IBobrilMouseEvent) {
    return this.data.onClickCallback(event.button);
  }
}

//-----------------------------------

export function SimpleComponentWithOnClick3(data: IData) {
  return (
    <div onClick={event => data.onClickCallback(event.button)}>
      Hello world!
    </div>
  );
}

//-----------------------------------

const SimpleComponentWithOnClick2NoTsx = b.component(
  SimpleComponentWithOnClick2
);
const SimpleComponentWithOnClick3NoTsx = b.component(
  SimpleComponentWithOnClick3
);

function App(version: number) {
  const callback = (button: number) => {
    alert("clicked!");
    return true;
  };
  return (
    <div>
      {version === 1 &&
        (<SimpleComponentWithOnClick1 onClickCallback={callback} /> ||
          SimpleComponentWithOnClick1({ onClickCallback: callback }))}
      {version === 2 &&
        (<SimpleComponentWithOnClick2 onClickCallback={callback} /> ||
          SimpleComponentWithOnClick2NoTsx({ onClickCallback: callback }))}
      {version === 3 &&
        (<SimpleComponentWithOnClick3 onClickCallback={callback} /> ||
          SimpleComponentWithOnClick3NoTsx({ onClickCallback: callback }))}
    </div>
  );
}
export const options: IOptions = {
  name: "onClick",
  options: [
    ["createComponent", () => App(1)],
    ["class", () => App(2)],
    ["functional", () => App(3)]
  ]
};
