import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";
import logger from "@/config/logger";

const getAuthUrl = new PanoTool({
  name: "get_google_auth",
  description:
    "Use this tool if the user is not authed. Pass scopes only related to the user requested functions, ask user for specific scopes if you cant decide. It returns a URL that the user can use to authenticate with Google.",
  schema: z.object({
    scopes: z
      .array(z.string())
      .describe("Scopes that relate to the user requested functions."),
  }),
  runner: async (input, config) => {
    logger.debug({ sessionId: config.configurable?.sessionId });
    const scopes = input.scopes;
    const queryString = (await import("query-string")).default;

    const scopeString = queryString.stringify(
      { scopes },
      { arrayFormat: "comma" },
    );

    const url = queryString.stringifyUrl({
      url: `${process.env.PANO_ENDPOINT}/oauth?${scopeString}`,
      query: {
        sessionId: config.configurable?.sessionId,
        providerId: "95b82967-65bb-4e71-9129-20114a23150d",
      },
    });

    return url;
  },
});

export default getAuthUrl;
