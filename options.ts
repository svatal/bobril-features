import * as b from "bobril";

export interface IOptions {
  name: string;
  options: [string, () => b.IBobrilNodeCommon][];
}
