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
      url: `${process.env.PANO_OAUTH_URL}?${scopeString}`,
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
    metadata: {
      toolProvider: {
        name: "Google Auth",
        logo: "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
      },
    },
  },
);

export default getGoogleAuth;
