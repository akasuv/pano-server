import { z } from "zod";
import GitHub from "@/oauth/providers/github";
import PanoTool from "@/tool-maker/PanoTool";

const createNewRepo = new PanoTool({
  name: "create_repo",
  description: "This tool will create a new repository in the github account",
  schema: z.object({
    name: z.string().describe("Name of the repository to create"),
  }),
  runner: async (input, config, oauthProvider: InstanceType<typeof GitHub>) => {
    const res = await oauthProvider.createNewRepo({ name: input.name });

    return JSON.stringify(res);
  },
});

export default createNewRepo;
