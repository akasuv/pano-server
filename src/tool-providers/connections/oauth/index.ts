import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import getOAuthProviders from "./tools/get-oauth-provider";
import getOAuthServerUrl from "./tools/get-oauth-server-url";

const oAuth = new PanoToolProvider({
  type: PanoToolProvider.Type.Connection,
  name: "Pano Connections OAuth",
  description:
    "This tool provider will allow you to connect to many services using OAuth",
});

oAuth.addTool(getOAuthProviders);
oAuth.addTool(getOAuthServerUrl);

export default oAuth;
