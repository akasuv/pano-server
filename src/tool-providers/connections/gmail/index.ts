import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import sendGmail from "./tools/send-email";

const gmail = new PanoToolProvider({
  type: PanoToolProvider.Type.Connection,
  name: "Gmail",
  description: "This is Gmail tool provider",
});

gmail.addTool(sendGmail);

export default gmail;
