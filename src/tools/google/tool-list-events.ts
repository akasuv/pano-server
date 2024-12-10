import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import OAuthGoogle from "@/integrations/google";

const listGoogleCalendarEvents = tool(
  async (_, config: LangGraphRunnableConfig) => {
    try {
      const oauth = await new OAuthGoogle().loadAuth(
        config.configurable!.accessToken,
      );

      if (oauth.isAuthed) {
        return await oauth.listEvents();
      }

      return "Not authenticated.";
    } catch (err) {
      return "Error fetching events: " + err;
    }
  },
  {
    name: "list_google_calendar_events",
    description:
      "This tool will list the upcoming events from the user's Google Calendar.",
    schema: z.object({
      noOp: z.string().optional().describe("No-op parameter."),
    }),
    metadata: {
      toolProvider: {
        name: "Google Calendar",
        logo: "https://lh3.googleusercontent.com/MxyI2wjFGTDQ0Vs_ydI9x0je9SeKQqwiYgvXHS9z9Tf-w0FHvkTXTfJLtkL6vUc28IPTdDDKGnmL_gyvsHLo9i67vNTGF7FdzMUblcGeSv24_MtT3dA",
      },
    },
  },
);

export default listGoogleCalendarEvents;
