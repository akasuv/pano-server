import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import getChannelMessages from "./tools/getChannelMessages";
import sendMessage from "./tools/sendMessage";
import getUsers from "./tools/getUsers";
import Slack from "@/oauth/providers/slack";

const slack = new PanoToolProvider({
  type: PanoToolProvider.Type.Connection,
  name: "Slack",
  description:
    "This tool provider will allow you to connect to slack and perform actions",
  oauthProvider: new Slack(),
});

slack.addTool(getChannelMessages);
slack.addTool(sendMessage);
slack.addTool(getUsers);

export default slack;
