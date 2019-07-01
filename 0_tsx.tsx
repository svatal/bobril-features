import * as b from "bobril";

b.init(() => ({ tag: "div", children: "Hello world 1" }));

b.init(() => <div>Hello world 2</div>);
