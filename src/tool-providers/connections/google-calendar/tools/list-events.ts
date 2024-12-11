import { z } from "zod";
import OAuthGoogle from "@/integrations/google";
import PanoTool from "@/tool-maker/PanoTool";

const listEvents = new PanoTool({
  name: "list_google_calendar_events",
  description:
    "This tool will list the upcoming events from the user's Google Calendar.",
  schema: z.object({
    noOp: z.string().optional().describe("No-op parameter."),
  }),
  runner: async (_, config) => {
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
});

export default listEvents;
