import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import openApp from "./tools/open-app";
import openUrl from "./tools/open-url";
import getInstalledApps from "./tools/get-installed-apps";

const systemToolProvider = new PanoToolProvider({
  name: "System Tool Provider",
  description:
    "This tool provider will provide tools to interact with the system.",
  type: PanoToolProvider.Type.System,
});

systemToolProvider.addTool(openUrl);
systemToolProvider.addTool(openApp);
systemToolProvider.addTool(getInstalledApps);

export default systemToolProvider;
