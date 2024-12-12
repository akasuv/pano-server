import logger from "@/config/logger";
import PanoTool from "@/tool-maker/PanoTool";
import { z } from "zod";

const openApp = new PanoTool({
  name: "open_app",
  description:
    "This tool initiates a request to open an app with the given path, use getInstalledApps to get the list of installed apps.",
  schema: z.object({
    path: z.string().optional().describe("The path to the app to open."),
  }),
  runner: async (input, config) => {
    try {
      logger.info({ input });
      return { args: input, funcName: "openApp" };
    } catch (err) {
      return "Error opening app: " + err;
    }
  },
});

export default openApp;
