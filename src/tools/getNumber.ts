import { tool } from "@langchain/core/tools";
import { z } from "zod";

const getNumber = tool(
  (input) => {
    return 1;
  },
  {
    name: "get_the_number",
    description: "This tool will get the number from your macbook",
    schema: z.object({
      noOp: z.string().optional().describe("No-op parameter."),
    }),
  },
);

export default getNumber;
