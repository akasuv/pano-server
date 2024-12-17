import Slack from "@/oauth/providers/slack";
import PanoTool from "@/tool-maker/PanoTool";

const oauth = new PanoTool({
  name: "slack_oauth",
  description: "This tool will get the slack oauth url",
  runner: async (_, config) => {
    const queryString = (await import("query-string")).default;

    const scopes = ["channels:history", "chat:write", "users:read"];
    const scopeString = queryString.stringify(
      { scopes },
      { arrayFormat: "comma" },
    );

    const url = queryString.stringifyUrl({
      url: `${process.env.PANO_ENDPOINT}/oauth?${scopeString}`,
      query: {
        sessionId: config.configurable?.sessionId,
        providerId: "31eefcd7-278c-47ab-ab7b-fdc6603c3d76",
      },
    });

    return url;
  },
});

export default oauth;
