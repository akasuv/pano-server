import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import OAuthGoogle from "@/integrations/google";

const sendGmail = tool(
  async (input, config: LangGraphRunnableConfig) => {
    console.log("Pano is sending email: ", input);
    try {
      const oauth = await new OAuthGoogle().loadAuth(
        config.configurable!.accessToken,
      );

      if (oauth.isAuthed) {
        return await oauth.sendEmail({
          title: input.title,
          body: input.body,
          recipient: input.recipient,
        });
      }

      return "Not authenticated.";
    } catch (err) {
      return "Error fetching events: " + err;
    }
  },
  {
    name: "send_gmail",
    description:
      "This tool will send an email using Gmail. The system will make sure user is authenticated before sending the email. You can use this tool directly, start by asking the recipient for their email address.",
    schema: z.object({
      title: z.string().describe("Title of the document."),
      body: z.string().describe("Body of the document in plain text."),
      recipient: z.string().describe("Recipient of the email."),
    }),
  },
);

export default sendGmail;
