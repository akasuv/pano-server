import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { listEvents } from "../../integrations/google";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import {
  createGoogleOauth2Client,
  setCredentials,
} from "@/integrations/google";

const listGoogleCalendarEvents = tool(
  async (_, config: LangGraphRunnableConfig) => {
    try {
      const oauth2Client = createGoogleOauth2Client();

      await setCredentials(oauth2Client, config.configurable!.accessToken);

      const isAuthed = oauth2Client.credentials.scope?.includes(
        "https://www.googleapis.com/auth/calendar.readonly",
      );

      console.log("isAuthed", isAuthed);

      if (isAuthed) {
        return await listEvents();
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
