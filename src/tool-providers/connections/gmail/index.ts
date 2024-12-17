import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import sendGmail from "./tools/send-email";
import Google from "@/oauth/providers/google";

const gmail = new PanoToolProvider({
  type: PanoToolProvider.Type.Connection,
  name: "Gmail",
  description: "This is Gmail tool provider",
  oauthProvider: new Google(),
});

gmail.addTool(sendGmail);

export default gmail;
