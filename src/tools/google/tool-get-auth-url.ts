import { tool } from "@langchain/core/tools";
import { z } from "zod";
import context from "@/context";

const getGoogleAuth = tool(
  async (input) => {
    const scopes = input.scopes;
    const queryString = (await import("query-string")).default;
    console.log("scopes", scopes);

    const scopeString = queryString.stringify(
      { scopes },
      { arrayFormat: "comma" },
    );

    const url = queryString.stringifyUrl({
      url: `http://localhost:8080/oauth?${scopeString}`,
      query: {
        sessionId: context.session?.id,
        provider: "google",
      },
    });

    return url;
  },
  {
    name: "get_google_auth",
    description:
      "Use this tool if the user is not authed. Pass scopes only related to the user requested functions, ask user for specific scopes if you cant decide. It returns a URL that the user can use to authenticate with Google.",
    schema: z.object({
      scopes: z
        .array(z.string())
        .describe("Scopes that relate to the user requested functions."),
    }),
  },
);

export default getGoogleAuth;
