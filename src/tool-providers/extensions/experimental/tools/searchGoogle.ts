import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";

const searchGoogleData = async ({
  query,
  numResults,
}: {
  query: string;
  numResults?: number;
}) => {
  const apiKey =
    "0a41ebd44cfe1571f744ff49e40450a1c345cdf19f98b906f006e4c2404c4517"; // Replace with your SerpAPI key
  const params = new URLSearchParams({
    engine: "google",
    api_key: apiKey,
    q: query,
    ...(numResults ? { num: numResults.toString() } : {}),
  });

  return await fetch(`https://serpapi.com/search?${params.toString()}`, {
    method: "GET",
    headers: {},
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw new Error(res.error);
      }
      return JSON.stringify(res.organic_results || []);
    });
};

const searchGoogle = new PanoTool({
  name: "search_google",
  description:
    "This tool performs a Google search and returns the top results. Provide a query to fetch results, optionally specify the number of results.",
  schema: z.object({
    query: z.string().describe("The search query to perform."),
    numResults: z
      .number()
      .optional()
      .describe(
        "The number of results to return. Defaults to the API's standard result count.",
      ),
  }),
  runner: async (input) => {
    return await searchGoogleData(input);
  },
});

export default searchGoogle;
