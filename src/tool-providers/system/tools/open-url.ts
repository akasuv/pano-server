import logger from "@/config/logger";
import PanoTool from "@/tool-maker/PanoTool";
import { z } from "zod";

const openUrl = new PanoTool({
  name: "open_url_on_machine",
  description: "This tool will open a URL or website on the user machine.",
  schema: z.object({
    url: z.string().describe("URL to open."),
  }),
  runner: async (input, config) => {
    try {
      logger.info({ input });
      return { args: input, funcName: "openUrl" };
    } catch (err) {
      return "Error opening url: " + err;
    }
  },
});

export default openUrl;
