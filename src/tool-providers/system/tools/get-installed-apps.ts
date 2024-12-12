import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";

const getInstalledApps = new PanoTool({
  name: "getInstalledApps",
  description:
    "This tool will return all the installed apps on the user machine.",
  schema: z.object({
    noOp: z.string().optional().describe("No-op parameter."),
  }),
  runner: async (input, config) => {
    return config.configurable?.installedApps;
  },
});

export default getInstalledApps;
