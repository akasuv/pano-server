import PanoTool from "@/tool-maker/PanoTool";
import Zoom from "@/oauth/providers/zoom";
import { z } from "zod";

const createMeeting = new PanoTool({
  name: "create_meeting",
  description: "This tool will create a meeting on zoom",
  schema: z.object({
    // topic: z.string().describe("The topic of the meeting"),
    // start_time: z.string().describe("The start time of the meeting"),
    // duration: z.string().describe("The duration of the meeting"),
    noOp: z.string().optional().describe("No operation"),
  }),
  runner: async (input, config, oauthProvider: InstanceType<typeof Zoom>) => {
    return await oauthProvider.createMeeting();
  },
});

export default createMeeting;
