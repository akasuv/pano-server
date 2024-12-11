import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import listEvents from "./tools/list-events";

const googleCalendar = new PanoToolProvider({
  name: "Google Calendar",
  description:
    "This tool provider will provide tools to interact with Google Calendar.",
  type: PanoToolProvider.Type.Connection,
});

googleCalendar.addTool(listEvents);

export default googleCalendar;
