import PanoTool from "@/tool-maker/PanoTool";
import Slack from "@/oauth/providers/slack";

const getUsers = new PanoTool({
  name: "slack_get_users",
  description: "This tool will get the users from a slack workspace",
  runner: async (_, config, oauthProvider: InstanceType<typeof Slack>) => {
    const res = await oauthProvider.getUsers();
    return JSON.stringify(res);
  },
});

export default getUsers;
