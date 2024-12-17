import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import listEvents from "./tools/list-events";
import Google from "@/oauth/providers/google";

const googleCalendar = new PanoToolProvider({
  name: "Google Calendar",
  description:
    "This tool provider will provide tools to interact with Google Calendar.",
  type: PanoToolProvider.Type.Connection,
  oauthProvider: new Google(),
});

googleCalendar.addTool(listEvents);

export default googleCalendar;
