import * as b from "bobril";
import { IOptions } from "./options";

interface IData {
  url: string;
}

function fetchUrl(
  url: string,
  then: (data: string) => void
): { cancelRequest: () => void } {
  console.log("fetch:", url);
  const timeoutId = window.setTimeout(() => {
    console.log("fetched:", url);
    then(`content of ${url}`);
  }, 1000);
  return {
    cancelRequest: () => {
      console.log("fetch canceled:", url);
      window.clearTimeout(timeoutId);
    }
  };
}

//-----------------------------------

interface ICtx extends b.IBobrilCtx {
  data: IData;
  fetching: boolean;
  fetchedUrl: string;
  cancelFetching: () => void;
  content: string;
}

const Fetcher1 = b.createComponent({
  id: "Fetcher1",

  init(ctx: ICtx) {
    ctx.fetching = false;
    ctx.fetchedUrl = undefined;
    ctx.content = "";
  },

  render(ctx: ICtx, me: b.IBobrilNode) {
    refetchIfNeeded(ctx);
    me.children = (
      <>
        Url: {ctx.data.url}
        <br />
        Fetching: {ctx.fetching.toString()}
        <br />
        Content: {ctx.content}
      </>
    );
  },

  destroy(ctx: ICtx) {
    if (ctx.fetching) ctx.cancelFetching();
  }
});

function refetchIfNeeded(ctx: ICtx) {
  if (ctx.fetchedUrl === ctx.data.url) return;
  if (ctx.fetching) ctx.cancelFetching();
  ctx.fetching = true;
  ctx.fetchedUrl = ctx.data.url;
  ctx.cancelFetching = fetchUrl(ctx.data.url, content => {
    ctx.content = content;
    ctx.fetching = false;
    b.invalidate(ctx);
  }).cancelRequest;
}

//-----------------------------------

function Fetcher3(data: IData) {
  const fetching = b.useState(false);
  const [content, setContent] = b.useState("");
  b.useEffect(() => {
    fetching(true);
    const cancel = fetchUrl(data.url, c => {
      fetching(false);
      setContent(c);
    }).cancelRequest;
    return () => fetching() && cancel();
  }, [data.url]);
  return (
    <div>
      Url: {data.url}
      <br />
      Fetching: {fetching().toString()}
      <br />
      Content: {content}
    </div>
  );
}

/*
useEffect hook:
callback: co se ma provest, muze vratit destruktor - automaticky se zavola pred pristim provedenim hooku nebo pri zruseni komponenty
  nevola se v ramci renderu, ale az po updatu DOMu. 
  Pokud potrebujete ovlivnit DOM, nepouzivat useEffect, ale useLayoutEffect - provola se v ten spravny cas, aby jeste stihnul vykresleni od browseru
deps (druhy parametr): ridi, jak casto se ma callback volat
  undefined - vola se vzdy
  pole zavislosti - pouze pokud se nejaka hodnota zmeni
  [] - nezmeni se nikdy -> efektivne mame init + destroy
*/

//-----------------------------------

function FetcherApp(version: number) {
  const url = b.useState("");
  return (
    <div>
      <input type="text" value={url} />
      <br />
      {version === 1 && <Fetcher1 url={url()} />}
      {version === 3 && <Fetcher3 url={url()} />}
    </div>
  );
}

export const options: IOptions = {
  name: "Init / Destroy (Fetcher)",
  options: [
    ["createComponent", () => FetcherApp(1)],
    ["functional with useEffect hook", () => FetcherApp(3)]
  ]
};
