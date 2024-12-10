import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import OAuthGoogle from "@/integrations/google";

const createGoogleDocs = tool(
  async (input, config: LangGraphRunnableConfig) => {
    try {
      const oauth = await new OAuthGoogle().loadAuth(
        config.configurable!.accessToken,
      );

      if (oauth.isAuthed) {
        return await oauth.createNewDocument({
          title: input.title,
          body: input.body,
        });
      }

      return "Not authenticated.";
    } catch (err) {
      return "Error fetching events: " + err;
    }
  },
  {
    name: "create_google_docs",
    description:
      "This tool will create a new Google Docs document. It requires the title and body of the document. After creating the document, it will return the document ID, give user the full url to the document.",
    schema: z.object({
      title: z.string().describe("Title of the document."),
      body: z.string().describe("Body of the document."),
    }),
    metadata: {
      toolProvider: {
        name: "Google Docs",
        logo: "https://lh3.googleusercontent.com/1DECuhPQ1y2ppuL6tdEqNSuObIm_PW64w0mNhm3KGafi40acOJkc4nvsZnThoDKTH8gWyxAnipJmvCiszX8R6UAUu1UyXPfF13d7",
      },
    },
  },
);

export default createGoogleDocs;
