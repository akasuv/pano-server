import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";
import Slack from "@/oauth/providers/slack";

const sendMessage = new PanoTool({
  name: "slack_send_message",
  description: "This tool will send a message to a slack channel",
  schema: z.object({
    message: z.string().describe("Message to send to the channel"),
  }),
  runner: async (input, config, oauthProvider: InstanceType<typeof Slack>) => {
    const res = await oauthProvider.sendMessage({ text: input.message });

    return res;
  },
});

export default sendMessage;
