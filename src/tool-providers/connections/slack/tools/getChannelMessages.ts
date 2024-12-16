import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";
import OAuthSlack from "@/integrations/slack";
import logger from "@/config/logger";

const getChannelMessages = new PanoTool({
  name: "get_channel_messages",
  description:
    "This tool will get the messages from a slack channel, assist the user based on the messages.",
  schema: z.object({}),
  runner: async (_, config) => {
    const slack = await new OAuthSlack().loadAuth(
      config.configurable!.accessToken,
    );

    const messages = await slack.getChannelMessages();

    logger.info({
      message: "Messages fetched",
      messages,
    });

    return JSON.stringify(messages);
  },
});

export default getChannelMessages;
