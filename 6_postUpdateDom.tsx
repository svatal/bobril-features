import * as b from "bobril";
import { observable } from "bobx";
import { IOptions } from "./options";

interface ICtx extends b.IBobrilCtx {
  width: number;
}

// using "ref" is not needed for root element - simple b.getDomNode(ctx.me) would work too.

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
Because we showing width usage of useLayoutEffect is correct, because if we would like blink of initial zero value. 
So useEffect we will show on changing browser title which is not part of DOM that Bobril controls.
*/

function WidthGetter3Bonus() {
  const [width, setWidth] = b.useState(0);
  const ref = b.useRef<b.IBobrilCacheNode>();
  b.useLayoutEffect(() => {
    const elem = b.getDomNode(ref.current) as HTMLElement;
    const width = elem.getBoundingClientRect().width;
    setWidth(width);
  });
  // clear separation of concerns to individual hooks
  b.useEffect(() => {
    const backupTitle = document.title;
    document.title = `width: ${width}`;
    return () => {
      // restore original page title
      document.title = backupTitle;
    };
  }, [width]); // we need to change title only when width changes
  return <div ref={ref}>{width}</div>;
}

//-----------------------------------

// Extract features to custom hooks

function useWidthOfRef() {
  const [width, setWidth] = b.useState(0);
  const ref = b.useRef<b.IBobrilCacheNode>();
  b.useLayoutEffect(() => {
    const elem = b.getDomNode(ref.current) as HTMLElement;
    const width = elem.getBoundingClientRect().width;
    setWidth(width);
  });
  return [width, ref] as const;
}

function useBrowserTitle(title: string) {
  b.useEffect(() => {
    const backupTitle = document.title;
    document.title = title;
    return () => {
      // restore original page title
      document.title = backupTitle;
    };
  }, [title]);
}

function WidthGetter3Bonus2() {
  // so clean and reusable
  const [width, ref] = useWidthOfRef();
  useBrowserTitle(`width: ${width}`);
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
    ],
    ["functional custom hooks", b.component(WidthGetter3Bonus2)]
  ]
};
