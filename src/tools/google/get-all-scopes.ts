import { z } from "zod";
import { tool } from "@langchain/core/tools";

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
  "https://mail.google.com",
];

const getAllScopes = tool(() => scopes, {
  name: "choose_scope",
  description:
    "This tool will return the scopes that can be used to authenticate with Google.",
  schema: z.object({
    noOp: z.string().optional().describe("No-op parameter."),
  }),
  metadata: {
    toolProvider: {
      name: "Google Auth",
      logo: "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
    },
  },
});

export default getAllScopes;
