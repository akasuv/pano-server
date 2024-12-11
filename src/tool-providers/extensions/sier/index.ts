import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import getTheNumber from "./tools/getTheNumber";

const sier = new PanoToolProvider({
  type: PanoToolProvider.Type.Extension,
  name: "SIER",
  description: "This tool provider is from SIER",
});

sier.addTool(getTheNumber);

export default sier;
