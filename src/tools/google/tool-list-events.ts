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
  },
);

export default listGoogleCalendarEvents;
