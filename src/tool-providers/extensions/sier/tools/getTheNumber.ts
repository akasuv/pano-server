import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";

const getTheNumber = new PanoTool({
  name: "getTheNumber",
  description: "This tool will get the number",
  schema: z.object({
    noOp: z.string().optional().describe("No-op parameter."),
  }),
  runner: async () => 42,
});

export default getTheNumber;
