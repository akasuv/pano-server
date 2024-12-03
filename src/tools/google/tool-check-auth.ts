import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { checkAuthedScope } from "../../integrations/google";

const checkGoogleAuth = tool(
  () => {
    console.log("checking google auth");
    const isAuthed = checkAuthedScope();
    return isAuthed ? "Authenticated" : "Not authenticated";
  },
  {
    name: "check_google_auth",
    description:
      "This tool will check if the user is authenticated with Google, run this before any other tool that requires Google authentication.",
    schema: z.object({
      noOp: z.string().optional().describe("No-op parameter."),
    }),
  },
);

export default checkGoogleAuth;
