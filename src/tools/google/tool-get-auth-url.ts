import { getAuthUrl } from "../../integrations/google";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const getGoogleAuth = tool(
  () => {
    const url = getAuthUrl();
    console.log("URL", url);
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
