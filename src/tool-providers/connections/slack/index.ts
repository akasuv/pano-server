import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import oauth from "./tools/oauth";
import getChannelMessages from "./tools/getChannelMessages";
import sendMessage from "./tools/sendMessage";
import getUsers from "./tools/getUsers";

const slack = new PanoToolProvider({
  type: PanoToolProvider.Type.Connection,
  name: "Slack",
  description:
    "This tool provider will allow you to connect to slack and perform actions",
});

slack.addTool(oauth);
slack.addTool(getChannelMessages);
slack.addTool(sendMessage);
slack.addTool(getUsers);

export default slack;
