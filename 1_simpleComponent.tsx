import * as b from "bobril";
import { IOptions } from "./options";

const SimpleComponent1 = b.createComponent({
  id: "SimpleComponent1",

  render(ctx: b.IBobrilCtx, me: b.IBobrilNode) {
    // createComponent means implicit me.tag = 'div';
    me.children = "Hello world!";
  }
});

//-----------------------------------

class SimpleComponent2 extends b.Component {
  static id = "SimpleComponent2_";

  render() {
    // this.me.tag = "div";
    return <div>Hello world!</div>;
  }
}

// If there were only tsx usages, this line wouldn't be necessary. For non-tsx world, class needs to be converted to component.
const SimpleComponent2NoTsx = b.component(SimpleComponent2);

//-----------------------------------

// id is from func name
function SimpleComponent3(this: b.Component) {
  // this.me.tag = "div";
  return <div>Hello world!</div>;
}

// Similarly to classes, if we use `this` in no-tsx context, we need to convert the function to component. Simple functions without `this` can be used as is.
const SimpleComponent3NoTsx = b.component(SimpleComponent3);

// example only: Component cannot return plain string (for usage in tsx), we need to use 'virtual' tag.
// Another case for virtual tag is, if we want to return group of tags.
function SimpleComponent3Tsx() {
  return <>Hello world!</>;
}

//-----------------------------------

export const options: IOptions = {
  name: "simple",
  options: [
    ["createComponent", SimpleComponent1],
    ["class", SimpleComponent2NoTsx],
    ["functional", SimpleComponent3NoTsx]
  ]
};
