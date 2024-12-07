import { getAuthUrl } from "../../integrations/google";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import context from "@/context";

const getGoogleAuth = tool(
  () => {
    console.log("getting context", context.session?.id);
    const url = "http://localhost:8080/oauth?sessionId=" + context.session?.id;
    return url;
  },
  {
    name: "get_google_auth",
    description:
      "Use this tool if the user is not authed. It will return a URL that the user can use to authenticate with Google.",
    schema: z.object({
      noOp: z.string().optional().describe("No-op parameter."),
    }),
  },
);

export default getGoogleAuth;
