import PanoTool from "@/tool-maker/PanoTool";
import OAuthSlack from "@/integrations/slack";

const getUsers = new PanoTool({
  name: "slack_get_users",
  description: "This tool will get the users from a slack workspace",
  runner: async (_, config) => {
    const slack = await new OAuthSlack().loadAuth(
      config.configurable!.accessToken,
    );

    const res = await slack.getUsers();
    return JSON.stringify(res);
  },
});

export default getUsers;
