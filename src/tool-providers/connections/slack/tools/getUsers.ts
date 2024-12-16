import PanoTool from "@/tool-maker/PanoTool";
import Slack from "@/integrations/slack";

const getUsers = new PanoTool({
  name: "slack_get_users",
  description: "This tool will get the users from a slack workspace",
  runner: async (_, config) => {
    const slack = await new Slack().loadAuth(config.configurable!.accessToken);

    const res = await slack.getUsers();
    return JSON.stringify(res);
  },
});

export default getUsers;
