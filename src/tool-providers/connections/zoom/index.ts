import Zoom from "@/oauth/providers/zoom";
import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import createMeeting from "./tools/createMeeting";

const zoom = new PanoToolProvider({
  name: "Zoom",
  description: "This tool provider is from Zoom",
  type: PanoToolProvider.Type.Connection,
  oauthProvider: new Zoom(),
});

zoom.addTool(createMeeting);

export default zoom;
