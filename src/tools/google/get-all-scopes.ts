import { z } from "zod";
import { tool } from "@langchain/core/tools";

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
];

const getAllScopes = tool(() => scopes, {
  name: "choose_scope",
  description:
    "This tool will return the scopes that can be used to authenticate with Google.",
  schema: z.object({
    noOp: z.string().optional().describe("No-op parameter."),
  }),
});

export default getAllScopes;
