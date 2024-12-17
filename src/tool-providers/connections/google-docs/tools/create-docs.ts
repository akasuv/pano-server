import { z } from "zod";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import PanoTool from "@/tool-maker/PanoTool";
import Google from "@/oauth/providers/google";

const createGoogleDocs = new PanoTool({
  name: "create_google_docs",
  description:
    "This tool will create a new Google Docs document. It requires the title and body of the document. After creating the document, it will return the document ID, give user the full url to the document.",
  schema: z.object({
    title: z.string().describe("Title of the document."),
    body: z.string().describe("Body of the document."),
  }),
  runner: async (
    input,
    config: LangGraphRunnableConfig,
    oauthProvider: InstanceType<typeof Google>,
  ) => {
    try {
      return await oauthProvider.createNewDocument({
        title: input.title,
        body: input.body,
      });

      return "Not authenticated.";
    } catch (err) {
      return "Error fetching events: " + err;
    }
  },
});

export default createGoogleDocs;
