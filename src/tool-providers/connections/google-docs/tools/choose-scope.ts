import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
  "https://mail.google.com",
];

const chooseScope = new PanoTool({
  name: "choose_scope",
  description:
    "This tool will return the scopes that can be used to authenticate with Google.",
  schema: z.object({
    noOp: z.string().optional().describe("No-op parameter."),
  }),
  runner: () => scopes,
});

export default chooseScope;
