import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";
import logger from "@/config/logger";

const getOAuthServerUrl = new PanoTool({
  name: "get_oauth_server_url",
  description: `This tool will start the OAuth flow for the given provider and scope by returning the authorization server URL, get oauth providers by using the tool 'oauth_providers',
  Example: Please click on the link below to give permissions: [Provider Name](Server URL).`,
  schema: z.object({
    providerId: z
      .string()
      .describe("Provider ID from the OAuth Providers list"),
    provider: z.string().describe("Provider name"),
    scopes: z.array(z.string()).describe("Scopes to request from the provider"),
  }),
  runner: async (input, config) => {
    logger.info({
      message: "get_oauth_server_url inputs",
      input,
    });
    const queryString = (await import("query-string")).default;

    const { providerId, scopes } = input;
    const scopeString = queryString.stringify(
      { scopes },
      { arrayFormat: "comma" },
    );

    const url = queryString.stringifyUrl({
      url: `${process.env.PANO_ENDPOINT}/oauth?${scopeString}`,
      query: {
        sessionId: config.configurable?.sessionId,
        providerId: providerId,
      },
    });

    return url;
  },
});

export default getOAuthServerUrl;
