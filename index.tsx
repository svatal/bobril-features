import * as b from "bobril";
import * as simple from "./1_simpleComponent";
import * as props from "./2_simpleComponentWithProps";
import * as onClick from "./3_simpleComponentWithOnClick";
import * as ctx from "./4_ctx";
import * as initDestroy from "./5_init_destroy";
import * as postUpdateDom from "./6_postUpdateDom";

b.init(() => <App />);

const options = [
  simple.options,
  props.options,
  onClick.options,
  ctx.options,
  initDestroy.options,
  postUpdateDom.options
];

function App() {
  const type = b.useState<number>(0);
  const subType = b.useState<number>(0);
  const subTypeOptions = options[type()].options;
  if (subType() >= subTypeOptions.length) subType(0);
  return (
    <div>
      <div style={{ float: "left" }}>
        {options.map((o, i) => (
          <>
            <label
              onClick={() => {
                type(i);
                return false;
              }}
            >
              <input type="radio" name="type" value={i == type()} />
              {o.name}
            </label>
            <br />
          </>
        ))}
      </div>
      <div style={{ float: "left" }}>
        {subTypeOptions.map((o, i) => (
          <>
            <label
              onClick={() => {
                subType(i);
                return false;
              }}
            >
              <input type="radio" name="subType" value={i == subType()} />
              {o[0]}
            </label>
            <br />
          </>
        ))}
      </div>
      <div
        style={{ clear: "both", border: "1px solid red" }}
        key={`${type()}/${subType()}`}
      >
        {options[type()].options[subType()][1]()}
      </div>
    </div>
  );
}
