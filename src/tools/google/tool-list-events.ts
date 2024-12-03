import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { listEvents } from "../../integrations/google";

const listGoogleCalendarEvents = tool(
  async () => {
    try {
      return await listEvents();
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
