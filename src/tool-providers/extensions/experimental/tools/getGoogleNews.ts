import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";

const getGoogleNewsData = async ({
  query,
  language,
  country,
}: {
  query: string;
  language?: string;
  country?: string;
}) => {
  const apiKey =
    "0a41ebd44cfe1571f744ff49e40450a1c345cdf19f98b906f006e4c2404c4517"; // Replace with your actual API key
  const params = new URLSearchParams({
    engine: "google_news",
    api_key: apiKey,
    q: query,
    ...(language ? { hl: language } : {}),
    ...(country ? { gl: country } : {}),
  });

  return await fetch(`https://serpapi.com/search?${params.toString()}`, {
    method: "GET",
    headers: {},
  })
    .then((res) => res.json())
    .then((res) => {
      return JSON.stringify(res.news_results || []);
    });
};

const getGoogleNews = new PanoTool({
  name: "get_google_news",
  description:
    "This tool fetches the latest news articles based on a search query. Optionally, you can filter by language and country.",
  schema: z.object({
    query: z.string().describe("The search query for the news."),
    language: z
      .string()
      .optional()
      .describe(
        "The language code for the news results (e.g., 'en' for English). Defaults to no specific language filter.",
      ),
    country: z
      .string()
      .optional()
      .describe(
        "The country code for the news results (e.g., 'US' for the United States). Defaults to no specific country filter.",
      ),
  }),
  runner: async (input) => {
    return await getGoogleNewsData(input);
  },
});

export default getGoogleNews;
