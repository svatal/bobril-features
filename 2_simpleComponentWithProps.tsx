import * as b from "bobril";
import { IOptions } from "./options";

interface IData {
  adjectivum: string;
}

//-----------------------------------

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

const SimpleComponentWithProps1 = b.createComponent<IData>({
  id: "SimpleComponentWithProps1",

  render(ctx: ICtx, me: b.IBobrilNode) {
    me.children = `Hello ${ctx.data.adjectivum} world!`;
  }
});

//-----------------------------------

class SimpleComponentWithProps2 extends b.Component<IData> {
  static id = "SimpleComponentWithProps2";

  render() {
    return <div>Hello {this.data.adjectivum} world!</div>;
  }
}

//-----------------------------------

function SimpleComponentWithProps3(data: IData) {
  return <div>Hello {data.adjectivum} world!</div>;
}

//-----------------------------------

const SimpleComponentWithProps2NoTsx = b.component(SimpleComponentWithProps2);
const SimpleComponentWithProps3NoTsx = b.component(SimpleComponentWithProps3);

function App(version: number) {
  return (
    <div>
      {version === 1 &&
        (<SimpleComponentWithProps1 adjectivum="component" /> ||
          SimpleComponentWithProps1({ adjectivum: "component" }))}
      {version === 2 &&
        (<SimpleComponentWithProps2 adjectivum="class" /> ||
          SimpleComponentWithProps2NoTsx({ adjectivum: "class" }))}
      {version === 3 &&
        (<SimpleComponentWithProps3 adjectivum="functional" /> ||
          SimpleComponentWithProps3NoTsx({ adjectivum: "functional" }))}
    </div>
  );
}

export const options: IOptions = {
  name: "props",
  options: [
    ["createComponent", () => App(1)],
    ["class", () => App(2)],
    ["functional", () => App(3)]
  ]
};
