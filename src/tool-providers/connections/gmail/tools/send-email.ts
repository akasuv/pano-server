import { z } from "zod";
import Google from "@/oauth/providers/google";
import PanoTool from "@/tool-maker/PanoTool";

const sendGmail = new PanoTool({
  name: "send_gmail",
  description:
    "This tool will send an email using Gmail. The system will make sure user is authenticated before sending the email. You can use this tool directly, start by asking the recipient for their email address.",
  schema: z.object({
    title: z.string().describe("Title of the document."),
    body: z.string().describe("Body of the document in plain text."),
    recipient: z.string().describe("Recipient of the email."),
  }),
  runner: async (input, config, oauthProvider: InstanceType<typeof Google>) => {
    try {
      return await oauthProvider.sendEmail({
        title: input.title,
        body: input.body,
        recipient: input.recipient,
      });

      return "Not authenticated.";
    } catch (err) {
      return "Error fetching events: " + err;
    }
  },
});

export default sendGmail;
