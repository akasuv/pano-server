import { z } from "zod";
import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import PanoTool from "@/tool-maker/PanoTool";

const browseWebsite = new PanoTool({
  name: "browse_website",
  description: "Browse a website and extract information from it.",
  schema: z.object({
    url: z.string().describe("The URL of the website to browse."),
  }),
  runner: async (input) => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings(
      process.env.OPENAI_API_KEY
        ? { azureOpenAIApiDeploymentName: "Embeddings2" }
        : {},
    );

    const browser = new WebBrowser({ model, embeddings });

    const result = await browser.invoke(input.url);

    return result;
  },
});

export default browseWebsite;
