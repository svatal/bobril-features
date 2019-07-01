import * as b from "bobril";
import { observable } from "bobx";
import { IOptions } from "./options";

interface ICtx extends b.IBobrilCtx {
  width: number;
}

const WidthGetter1 = b.createVirtualComponent({
  id: "widthGetter",
  init(ctx: ICtx) {
    ctx.width = 0;
  },
  render(ctx: ICtx, me: b.IBobrilNode) {
    me.children = b.withRef(<div>{ctx.width}</div>, ctx, "div");
  },
  postInitDom(ctx: ICtx) {
    updateWidth(ctx);
  },
  postUpdateDom(ctx: ICtx) {
    updateWidth(ctx);
  }
});

function updateWidth(ctx: ICtx) {
  const elem = b.getDomNode(ctx.refs!["div"]) as HTMLElement;
  const width = elem.getBoundingClientRect().width;
  if (width !== ctx.width) {
    ctx.width = width;
    b.invalidate();
  }
}

//-----------------------------------

class WidthGetter2 extends b.Component<{}> {
  @observable width = 0;
  render() {
    console.log("WidthGetter2 render", this.width);
    return <div ref="div">{this.width}</div>;
  }
  postInitDom() {
    this.updateWidth();
  }
  postUpdateDom() {
    this.updateWidth();
  }
  updateWidth() {
    const elem = b.getDomNode(this.refs!["div"]) as HTMLElement;
    const width = elem.getBoundingClientRect().width;
    if (width !== this.width) {
      this.width = width;
    }
  }
}

//-----------------------------------

function WidthGetter3() {
  const [width, setWidth] = b.useState(0);
  const ref = b.useRef<b.IBobrilCacheNode>();
  b.useLayoutEffect(() => {
    const elem = b.getDomNode(ref.current) as HTMLElement;
    const width = elem.getBoundingClientRect().width;
    setWidth(width);
  });
  return <div ref={ref}>{width}</div>;
}

/*
Protoze z DOMu jen cteme, ve skutecnosti by byl lepsi useEffect. useLayoutEffect se od nej lisi v jedinem aspektu - pousti se ve chvili, 
kdy browser jeste nestihne prekreslit takze nase updaty se zohledni ihned. Takze abych ho trochu ospravedlnil, pridal jsem update window title :)
 */

function WidthGetter3Bonus() {
  const [width, setWidth] = b.useState(0);
  const ref = b.useRef<b.IBobrilCacheNode>();
  const origPageTitle = b.useState(""); //
  b.useLayoutEffect(() => {
    const elem = b.getDomNode(ref.current) as HTMLElement;
    const width = elem.getBoundingClientRect().width;
    setWidth(width);
    if (origPageTitle() === "") origPageTitle(document.title); //
    document.title = `width: ${width}`; //
  });
  b.useLayoutEffect(() => () => (document.title = origPageTitle()), []); // restore original page title
  return <div ref={ref}>{width}</div>;
}

//-----------------------------------

export const options: IOptions = {
  name: "postUpdateDom (WidthGetter)",
  options: [
    ["createComponent, lowlevel setRef", WidthGetter1],
    ["class, text setRef", b.component(WidthGetter2)],
    ["functional useLayoutEffect, useRef", b.component(WidthGetter3)],
    [
      "functional useLayoutEffect, useRef, window title",
      b.component(WidthGetter3Bonus)
    ]
  ]
};
