import { z } from "zod";
import Google from "@/oauth/providers/google";
import PanoTool from "@/tool-maker/PanoTool";
import logger from "@/config/logger";

const listEvents = new PanoTool({
  name: "list_google_calendar_events",
  description:
    "This tool will list the upcoming events from the user's Google Calendar.",
  schema: z.object({
    noOp: z.string().optional().describe("No-op parameter."),
  }),
  runner: async (_, config, oauthProvider: InstanceType<typeof Google>) => {
    try {
      logger.info({
        message: "Auth check wrapper: Authed",
        provider: oauthProvider.isAuthed,
      });
      return await oauthProvider.listEvents();
    } catch (err) {
      return "Error fetching events: " + err;
    }
  },
});

export default listEvents;
