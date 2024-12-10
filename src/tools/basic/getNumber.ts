import { tool } from "@langchain/core/tools";
import { z } from "zod";

// For testing
const getNumber = tool(() => 42, {
  name: "get_the_number",
  description: "This tool will get the number",
  schema: z.object({
    noOp: z.string().optional().describe("No-op parameter."),
  }),
  metadata: {
    toolProvider: {
      name: "SIER",
    },
  },
});

export default getNumber;
